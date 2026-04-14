import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IListDTO } from '@dtos/IListDTO';
import type { Service } from '@modules/companies/entities/Service';
import { ListServiceService } from './ListServiceService';

export class ListServiceController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & Partial<Service>
    >,
    response: Response<IListDTO<Service>>,
  ): Promise<void> {
    const listService = container.resolve(ListServiceService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const services = await listService.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(services.code).json(services);
  }
}
