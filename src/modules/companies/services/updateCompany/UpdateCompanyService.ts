import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Path, Put, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICompanyDTO } from '@modules/companies/dtos/ICompanyDTO';
import type { Company } from '@modules/companies/entities/Company';
import { Service } from '@modules/companies/entities/Service';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { Address } from '@modules/users/entities/Address';
import type { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';
import { updateAttribute } from '@utils/mappers';
import { SimpleDependency } from '@utils/simpleDependency';

@Route('/companies')
@injectable()
export class UpdateCompanyService extends SimpleDependency {
  public constructor(
    @inject('CompaniesRepository')
    private readonly companiesRepository: ICompaniesRepository,

    @inject('AddressesRepository')
    private readonly addressesRepository: IAddressesRepository,

    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,

    @inject('FilesRepository')
    protected readonly filesRepository: IFilesRepository,

    @inject('StorageProvider')
    protected readonly storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {
    super();
  }

  private async patchServices({
    services,
    trx,
    company,
  }: {
    trx: QueryRunner;
    company: Company;
    services: Array<Service>;
  }): Promise<void> {
    await this.createOrUpdateEntityArray({
      repository: this.servicesRepository,
      targetReference: 'companyId',
      entities: services,
      target: company,
      trx,
    });
  }

  private async patchAddress({
    address,
    trx,
    company,
  }: {
    trx: QueryRunner;
    company: Company;
    address: Address;
  }): Promise<void> {
    await this.createOrUpdateEntity({
      repository: this.addressesRepository,
      reference: 'address',
      target: company,
      entity: address,
      trx,
    });
  }

  private async patchBanner({
    companyData,
    trx,
    company,
  }: {
    trx: QueryRunner;
    company: Company;
    companyData: ICompanyDTO;
  }): Promise<void> {
    await this.patchFile({
      data: companyData,
      field: 'bannerId',
      target: company,
      trx,
    });
  }

  @Put('{id}')
  @Tags('Company')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() companyData: ICompanyDTO,
  ): Promise<IResponseDTO<Company>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const { address, services = [], bannerId, ...rest } = companyData;

      const company = await this.companiesRepository.findBy(
        {
          where: { id },
          select: {
            id: true,
            addressId: true,
            bannerId: true,
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

      if (address) await this.patchAddress({ company, address, trx });
      if (bannerId) await this.patchBanner({ company, companyData, trx });
      if (services.length) await this.patchServices({ company, services, trx });

      await this.companiesRepository.update(
        updateAttribute(company, rest),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:companies`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated company',
        data: instanceToInstance(company),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
