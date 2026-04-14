import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IServiceDTO } from '@modules/companies/dtos/IServiceDTO';
import type { Service } from '@modules/companies/entities/Service';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/services')
@injectable()
export class CreateServiceService {
  public constructor(
    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,

    @inject('CompaniesRepository')
    private readonly companiesRepository: ICompaniesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Post()
  @Tags('Service')
  public async execute(
    @Inject() connection: IConnection,
    @Body() serviceData: IServiceDTO,
  ): Promise<IResponseDTO<Service>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const company = await this.companiesRepository.exists(
        { where: { id: serviceData.companyId } },
        trx,
      );

      if (!company) {
        throw new AppError(
          'NOT_FOUND',
          `Company not found with id: "${serviceData.companyId}"`,
          404,
        );
      }

      const service = await this.servicesRepository.create(serviceData, trx);

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:services`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:companies:${service.companyId}`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'Service successfully created',
        data: instanceToInstance(service),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
