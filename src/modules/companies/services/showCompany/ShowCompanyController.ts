import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICompanyDTO } from '@modules/companies/dtos/ICompanyDTO';
import type { Company } from '@modules/companies/entities/Company';
import { ShowCompanyService } from './ShowCompanyService';

export class ShowCompanyController {
  public async handle(
    request: Request<Required<ICompanyDTO>>,
    response: Response<IResponseDTO<Company>>,
  ): Promise<void> {
    const showCompany = container.resolve(ShowCompanyService);

    const { id } = request.params;

    const company = await showCompany.execute(request.dbConnection, id);

    response.status(company.code).json(company);
  }
}
