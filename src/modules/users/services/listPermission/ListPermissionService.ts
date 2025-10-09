import { injectable, inject } from 'tsyringe';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Permission } from '@modules/users/entities/Permission';
import { instanceToInstance } from 'class-transformer';
import { ICacheDTO } from '@dtos/ICacheDTO';
import { IListDTO } from '@dtos/IListDTO';
import { IConnection } from '@shared/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Get, Route, Tags, Query, Inject } from 'tsoa';

@Route('/permissions')
@injectable()
export class ListPermissionService {
  public constructor(
    @inject('PermissionsRepository')
    private readonly permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('Permission')
  public async execute(
    @Inject() connection: IConnection,
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: FindOptionsWhere<Permission>,
  ): Promise<IListDTO<Permission>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:permissions:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache =
        await this.cacheProvider.recovery<ICacheDTO<Permission>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.permissionsRepository.findAll(
          {
            where: filters,
            page,
            limit,
            select: { id: true, name: true },
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
        message: 'Successfully listed permissions',
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
