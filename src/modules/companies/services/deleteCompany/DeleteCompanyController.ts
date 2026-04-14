import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICompanyDTO } from '@modules/companies/dtos/ICompanyDTO';
import { DeleteCompanyService } from './DeleteCompanyService';

export class DeleteCompanyController {
  public async handle(
    request: Request<Required<ICompanyDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteCompany = container.resolve(DeleteCompanyService);

    const { id } = request.params;

    const company = await deleteCompany.execute(request.dbConnection, id);

    response.sendStatus(company.code);
  }
}
