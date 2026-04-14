import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IServiceDTO } from '@modules/companies/dtos/IServiceDTO';
import type { Service } from '@modules/companies/entities/Service';
import { CreateServiceService } from './CreateServiceService';

export class CreateServiceController {
  public async handle(
    request: Request<never, never, IServiceDTO>,
    response: Response<IResponseDTO<Service>>,
  ): Promise<void> {
    const serviceData = request.body;

    const createService = container.resolve(CreateServiceService);

    const service = await createService.execute(
      request.dbConnection,
      serviceData,
    );

    response.status(service.code).json(service);
  }
}
