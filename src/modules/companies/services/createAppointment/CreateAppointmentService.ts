import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import { SendNotification } from '@jobs/SendNotification';
import type { IAppointmentDTO } from '@modules/companies/dtos/IAppointmentDTO';
import type { Appointment } from '@modules/companies/entities/Appointment';
import type { IAppointmentsRepository } from '@modules/companies/repositories/IAppointmentsRepository';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import { NotificationAction } from '@modules/system/enums/NotificationAction';
import { NotificationType } from '@modules/system/enums/NotificationType';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IQueueProvider } from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/appointments')
@injectable()
export class CreateAppointmentService {
  public constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository,

    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,

    @inject('QueueProvider')
    private readonly queueProvider: IQueueProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Post()
  @Tags('Appointment')
  public async execute(
    @Inject() connection: IConnection,
    @Body() appointmentData: IAppointmentDTO,
  ): Promise<IResponseDTO<Appointment>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const service = await this.servicesRepository.findBy(
        {
          where: {
            id: appointmentData.serviceId,
            company: {
              id: appointmentData.companyId,
              employees: { id: appointmentData.employeeId },
            },
          },
          select: {
            durationInMinutes: true,
          },
        },
        trx,
      );

      if (!service) {
        throw new AppError(
          'NOT_FOUND',
          `Service not found with id: "${appointmentData.serviceId}"`,
          404,
        );
      }

      const isAvailable = await this.appointmentsRepository.checkAvailability(
        {
          durationInMinutes: service.durationInMinutes,
          employeeId: appointmentData.employeeId,
          companyId: appointmentData.companyId,
          datetime: appointmentData.datetime,
        },
        trx,
      );

      if (!isAvailable) {
        throw new AppError(
          'CONFLICT',
          'Appointment not available for the selected datetime',
          409,
        );
      }

      const appointment = await this.appointmentsRepository.create(
        { durationInMinutes: service.durationInMinutes, ...appointmentData },
        trx,
      );

      await this.queueProvider.execute({
        job: SendNotification,
        attempts: 1,
        data: {
          client: connection.client,
          data: {
            action: NotificationAction.CREATED,
            type: NotificationType.APPOINTMENT,
            userCondition: { id: appointmentData.employeeId },
            referenceId: appointment.id,
            requesterId: appointmentData.clientId,
          },
        },
      });

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:appointments`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:companies:${appointmentData.companyId}`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:users:${appointmentData.employeeId}`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:users:${appointmentData.clientId}`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'Appointment successfully created',
        data: instanceToInstance(appointment),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
