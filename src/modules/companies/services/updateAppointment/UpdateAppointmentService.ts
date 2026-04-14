import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Path, Put, Route, Tags } from 'tsoa';
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
export class UpdateAppointmentService {
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

  @Put('{id}')
  @Tags('Appointment')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() appointmentData: IAppointmentDTO,
  ): Promise<IResponseDTO<Appointment>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const appointment = await this.appointmentsRepository.findBy(
        {
          where: { id },
          select: {
            id: true,
            companyId: true,
            employeeId: true,
            clientId: true,
          },
        },
        trx,
      );

      if (!appointment) {
        throw new AppError(
          'NOT_FOUND',
          `Appointment not found with id: "${id}"`,
          404,
        );
      }

      const service = await this.servicesRepository.findBy(
        {
          where: {
            id,
            company: {
              id: appointment.companyId,
              employees: { id: appointment.employeeId },
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

      await this.appointmentsRepository.update(
        {
          id,
          durationInMinutes: service.durationInMinutes,
          companyId: appointment.companyId,
          employeeId: appointment.employeeId,
          datetime: appointmentData.datetime,
        },
        trx,
      );

      await this.queueProvider.execute({
        job: SendNotification,
        attempts: 1,
        data: {
          client: connection.client,
          data: {
            action: NotificationAction.UPDATED,
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
        `${connection.client}:companies:${appointment.companyId}`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:users:${appointment.employeeId}`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:users:${appointment.clientId}`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated appointment',
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
