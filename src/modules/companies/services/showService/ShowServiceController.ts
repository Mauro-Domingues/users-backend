import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IServiceDTO } from '@modules/companies/dtos/IServiceDTO';
import type { Service } from '@modules/companies/entities/Service';
import { ShowServiceService } from './ShowServiceService';

export class ShowServiceController {
  public async handle(
    request: Request<Required<IServiceDTO>>,
    response: Response<IResponseDTO<Service>>,
  ): Promise<void> {
    const showService = container.resolve(ShowServiceService);

    const { id } = request.params;

    const service = await showService.execute(request.dbConnection, id);

    response.status(service.code).json(service);
  }
}
