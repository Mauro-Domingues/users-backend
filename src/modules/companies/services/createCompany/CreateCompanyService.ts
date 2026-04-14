import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICompanyDTO } from '@modules/companies/dtos/ICompanyDTO';
import type { Company } from '@modules/companies/entities/Company';
import { Service } from '@modules/companies/entities/Service';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import { Address } from '@modules/users/entities/Address';
import type { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/companies')
@injectable()
export class CreateCompanyService {
  public constructor(
    @inject('CompaniesRepository')
    private readonly companiesRepository: ICompaniesRepository,

    @inject('ServicesRepository')
    private readonly servicesRepository: IServicesRepository,

    @inject('AddressesRepository')
    private readonly addressesRepository: IAddressesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private async setAddress({
    address,
    trx,
    company,
  }: {
    trx: QueryRunner;
    company: Company;
    address: Address;
  }): Promise<void> {
    company.address = await this.addressesRepository.create(address, trx);
  }

  private async setServices({
    services,
    trx,
    company,
  }: {
    trx: QueryRunner;
    company: Company;
    services: Array<Service>;
  }): Promise<void> {
    company.services = await this.servicesRepository.createMany(services, trx);
  }

  @Post()
  @Tags('Company')
  public async execute(
    @Inject() connection: IConnection,
    @Body() companyData: ICompanyDTO,
  ): Promise<IResponseDTO<Company>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const { address, services = [], ...rest } = companyData;

      const company = await this.companiesRepository.create(rest, trx);

      if (address) await this.setAddress({ company, address, trx });
      if (services.length) await this.setServices({ company, services, trx });

      await this.companiesRepository.update(company, trx);

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:companies`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'Company successfully created',
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
