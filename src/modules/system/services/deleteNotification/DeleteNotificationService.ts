import { Delete, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { INotificationsRepository } from '@modules/system/repositories/INotificationsRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/notifications')
@injectable()
export class DeleteNotificationService {
  public constructor(
    @inject('NotificationsRepository')
    private readonly notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('Notification')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const notification = await this.notificationsRepository.exists(
        { where: { id } },
        trx,
      );

      if (!notification) {
        throw new AppError('NOT_FOUND', 'Notification not found', 404);
      }

      await this.notificationsRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:notifications`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted notification',
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
