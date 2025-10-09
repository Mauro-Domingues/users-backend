import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import { DeletePermissionService } from './DeletePermissionService';

export class DeletePermissionController {
  public async handle(
    request: Request<Required<IPermissionDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deletePermission = container.resolve(DeletePermissionService);

    const { id } = request.params;

    const permission = await deletePermission.execute(request.dbConnection, id);

    response.send(permission);
  }
}
