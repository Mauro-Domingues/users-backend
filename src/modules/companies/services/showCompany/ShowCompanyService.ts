import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Company } from '@modules/companies/entities/Company';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/companies')
@injectable()
export class ShowCompanyService {
  public constructor(
    @inject('CompaniesRepository')
    private readonly companiesRepository: ICompaniesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get('{id}')
  @Tags('Company')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<Company>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${connection.client}:companies:${id}`;

      let cache = await this.cacheProvider.recovery<Company>(cacheKey);

      if (!cache) {
        const company = await this.companiesRepository.findBy(
          {
            where: { id },
            relations: {
              address: true,
              banner: true,
              employees: { profile: { avatar: true } },
              services: true,
              appointments: true,
            },
            select: {
              id: true,
              schedule: true,
              tolerance: true,
              address: {
                id: true,
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
              banner: { id: true, file: true },
              cnpj: true,
              status: true,
              appointments: {
                id: true,
                client: { id: true, profile: { fullName: true, phone: true } },
                datetime: true,
                durationInMinutes: true,
                employeeId: true,
                service: { name: true },
              },
              employees: {
                id: true,
                profile: {
                  fullName: true,
                  phone: true,
                  avatar: { file: true },
                },
              },
              tradeName: true,
              corporateName: true,
              services: {
                id: true,
                name: true,
                description: true,
                price: true,
                durationInMinutes: true,
                status: true,
              },
            },
          },
          trx,
        );

        if (!company) {
          throw new AppError(
            'NOT_FOUND',
            `Company not found with id: "${id}"`,
            404,
          );
        }

        cache = company;
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'Company found successfully',
        data: instanceToInstance(cache),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
