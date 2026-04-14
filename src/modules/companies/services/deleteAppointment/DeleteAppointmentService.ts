import { Delete, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import { SendNotification } from '@jobs/SendNotification';
import type { IAppointmentsRepository } from '@modules/companies/repositories/IAppointmentsRepository';
import { NotificationAction } from '@modules/system/enums/NotificationAction';
import { NotificationType } from '@modules/system/enums/NotificationType';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IQueueProvider } from '@shared/container/providers/QueueProvider/models/IQueueProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/appointments')
@injectable()
export class DeleteAppointmentService {
  public constructor(
    @inject('AppointmentsRepository')
    private readonly appointmentsRepository: IAppointmentsRepository,

    @inject('QueueProvider')
    private readonly queueProvider: IQueueProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('Appointment')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const appointment = await this.appointmentsRepository.findBy(
        {
          where: { id },
          select: {
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

      await this.appointmentsRepository.delete({ id }, trx);

      await this.queueProvider.execute({
        job: SendNotification,
        attempts: 1,
        data: {
          client: connection.client,
          data: {
            action: NotificationAction.DELETED,
            type: NotificationType.APPOINTMENT,
            userCondition: { id: appointment.employeeId },
            referenceId: appointment.id,
            requesterId: appointment.clientId,
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
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted appointment',
        data: null,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
