import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IServiceDTO } from '@modules/companies/dtos/IServiceDTO';
import type { Service } from '@modules/companies/entities/Service';
import { UpdateServiceService } from './UpdateServiceService';

export class UpdateServiceController {
  public async handle(
    request: Request<Required<IServiceDTO>, never, IServiceDTO>,
    response: Response<IResponseDTO<Service>>,
  ): Promise<void> {
    const updateService = container.resolve(UpdateServiceService);

    const { id } = request.params;
    const serviceData = request.body;

    const service = await updateService.execute(
      request.dbConnection,
      id,
      serviceData,
    );

    response.status(service.code).json(service);
  }
}
