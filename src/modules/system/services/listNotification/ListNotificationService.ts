import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Query, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { ICacheDTO } from '@dtos/ICacheDTO';
import type { IListDTO } from '@dtos/IListDTO';
import type { Notification } from '@modules/system/entities/Notification';
import type { INotificationsRepository } from '@modules/system/repositories/INotificationsRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/notifications')
@injectable()
export class ListNotificationService {
  public constructor(
    @inject('NotificationsRepository')
    private readonly notificationsRepository: INotificationsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('Notification')
  public async execute(
    @Inject() connection: IConnection,
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: Partial<Notification>,
    @Inject() userId: string,
  ): Promise<IListDTO<Notification>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:notifications:${userId}:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache =
        await this.cacheProvider.recovery<ICacheDTO<Notification>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.notificationsRepository.findAll(
          {
            where: filters,
            page,
            limit,
            select: {
              id: true,
              title: true,
              content: true,
              action: true,
              read: true,
              createdAt: true,
              referenceId: true,
              type: true,
            },
            order: { createdAt: 'DESC' },
          },
          trx,
        );

        cache = { data: instanceToInstance(list), total: amount };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LISTED',
        message: 'Successfully listed notifications',
        pagination: {
          total: cache.total,
          page,
          perPage: limit,
          lastPage: Math.ceil(cache.total / limit),
        },
        data: cache.data,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
