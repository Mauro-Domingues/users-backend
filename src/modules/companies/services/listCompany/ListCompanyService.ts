import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Query, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { ICacheDTO } from '@dtos/ICacheDTO';
import type { IListDTO } from '@dtos/IListDTO';
import type { Company } from '@modules/companies/entities/Company';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/companies')
@injectable()
export class ListCompanyService {
  public constructor(
    @inject('CompaniesRepository')
    private readonly companiesRepository: ICompaniesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('Company')
  public async execute(
    @Inject() connection: IConnection,
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: Partial<Company>,
  ): Promise<IListDTO<Company>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:companies:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache =
        await this.cacheProvider.recovery<ICacheDTO<Company>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.companiesRepository.findAll(
          {
            where: filters,
            page,
            limit,
            relations: { address: true, banner: true },
            select: {
              id: true,
              address: {
                city: true,
                complement: true,
                district: true,
                lat: true,
                lon: true,
                number: true,
                uf: true,
                street: true,
                zipcode: true,
              },
              banner: { file: true },
              cnpj: true,
              tradeName: true,
              corporateName: true,
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
        message: 'Successfully listed companies',
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
