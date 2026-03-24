import { Inject, Patch, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { INotificationsRepository } from '@modules/system/repositories/INotificationsRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/notifications')
@injectable()
export class ViewNotificationService {
  public constructor(
    @inject('NotificationsRepository')
    private readonly notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Patch('{id}')
  @Tags('Notification')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Inject() userId: string,
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

      await this.notificationsRepository.update({ id, read: true }, trx);
      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:notifications:${userId}`,
      );

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'VIWED',
        message: 'Notification viewed successfully',
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
