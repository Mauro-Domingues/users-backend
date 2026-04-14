import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Query, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { ICacheDTO } from '@dtos/ICacheDTO';
import type { IListDTO } from '@dtos/IListDTO';
import type { Service } from '@modules/companies/entities/Service';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/services')
@injectable()
export class ListServiceService {
  public constructor(
    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('Service')
  public async execute(
    @Inject() connection: IConnection,
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: Partial<Service>,
  ): Promise<IListDTO<Service>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:services:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache =
        await this.cacheProvider.recovery<ICacheDTO<Service>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.servicesRepository.findAll(
          {
            where: filters,
            page,
            limit,
            select: {
              id: true,
              name: true,
              description: true,
              durationInMinutes: true,
              price: true,
            },
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
        message: 'Successfully listed services',
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
