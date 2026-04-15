import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Service } from '@modules/companies/entities/Service';
import { SelectServiceService } from './SelectServiceService';

export class SelectServiceController {
  public async handle(
    request: Request<never, never, never, Partial<Service>>,
    response: Response<IResponseDTO<Array<Service>>>,
  ): Promise<void> {
    const listService = container.resolve(SelectServiceService);

    const filters = request.query;

    const services = await listService.execute(request.dbConnection, filters);

    response.status(services.code).json(services);
  }
}
