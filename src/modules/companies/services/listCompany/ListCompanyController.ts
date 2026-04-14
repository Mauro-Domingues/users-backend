import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IListDTO } from '@dtos/IListDTO';
import type { Company } from '@modules/companies/entities/Company';
import { ListCompanyService } from './ListCompanyService';

export class ListCompanyController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & Partial<Company>
    >,
    response: Response<IListDTO<Company>>,
  ): Promise<void> {
    const listCompany = container.resolve(ListCompanyService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const companies = await listCompany.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(companies.code).json(companies);
  }
}
