import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Service } from '@modules/companies/entities/Service';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/select-services')
@injectable()
export class SelectServiceService {
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
    @Inject() filters: Partial<Service>,
  ): Promise<IResponseDTO<Array<Service>>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:services:select:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<Array<Service>>(cacheKey);

      if (!cache) {
        const { list } = await this.servicesRepository.findAll(
          {
            where: filters,
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
        cache = instanceToInstance(list);
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LISTED',
        message: 'Successfully listed services',
        data: cache,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
