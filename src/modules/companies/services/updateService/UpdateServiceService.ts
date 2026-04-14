import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Path, Put, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IServiceDTO } from '@modules/companies/dtos/IServiceDTO';
import type { Service } from '@modules/companies/entities/Service';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';
import { updateAttribute } from '@utils/mappers';

@Route('/services')
@injectable()
export class UpdateServiceService {
  public constructor(
    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,

    @inject('CompaniesRepository')
    private readonly companiesRepository: ICompaniesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Put('{id}')
  @Tags('Service')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() serviceData: IServiceDTO,
  ): Promise<IResponseDTO<Service>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const service = await this.servicesRepository.findBy(
        {
          where: { id },
          select: { id: true, companyId: true },
        },
        trx,
      );

      if (!service) {
        throw new AppError(
          'NOT_FOUND',
          `Service not found with id: "${id}"`,
          404,
        );
      }

      if (
        serviceData.companyId &&
        serviceData.companyId !== service.companyId
      ) {
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
      }

      await this.servicesRepository.update(
        updateAttribute(service, serviceData),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:services`,
      );
      await this.cacheProvider.invalidate(
        `${connection.client}:companies:${service.companyId}`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated service',
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
