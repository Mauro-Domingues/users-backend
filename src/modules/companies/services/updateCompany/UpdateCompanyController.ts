import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICompanyDTO } from '@modules/companies/dtos/ICompanyDTO';
import type { Company } from '@modules/companies/entities/Company';
import { UpdateCompanyService } from './UpdateCompanyService';

export class UpdateCompanyController {
  public async handle(
    request: Request<Required<ICompanyDTO>, never, ICompanyDTO>,
    response: Response<IResponseDTO<Company>>,
  ): Promise<void> {
    const updateCompany = container.resolve(UpdateCompanyService);

    const { id } = request.params;
    const companyData = request.body;

    const company = await updateCompany.execute(
      request.dbConnection,
      id,
      companyData,
    );

    response.status(company.code).json(company);
  }
}
