import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICompanyDTO } from '@modules/companies/dtos/ICompanyDTO';
import type { Company } from '@modules/companies/entities/Company';
import { CreateCompanyService } from './CreateCompanyService';

export class CreateCompanyController {
  public async handle(
    request: Request<never, never, ICompanyDTO>,
    response: Response<IResponseDTO<Company>>,
  ): Promise<void> {
    const companyData = request.body;

    const createCompany = container.resolve(CreateCompanyService);

    const company = await createCompany.execute(
      request.dbConnection,
      companyData,
    );

    response.status(company.code).json(company);
  }
}
