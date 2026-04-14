import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IServiceDTO } from '@modules/companies/dtos/IServiceDTO';
import { DeleteServiceService } from './DeleteServiceService';

export class DeleteServiceController {
  public async handle(
    request: Request<Required<IServiceDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteService = container.resolve(DeleteServiceService);

    const { id } = request.params;

    const service = await deleteService.execute(request.dbConnection, id);

    response.sendStatus(service.code);
  }
}
