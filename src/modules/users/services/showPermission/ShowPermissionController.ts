import { Permission } from '@modules/users/entities/Permission';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import { ShowPermissionService } from './ShowPermissionService';

export class ShowPermissionController {
  public async handle(
    request: Request<Required<IPermissionDTO>>,
    response: Response<IResponseDTO<Permission>>,
  ): Promise<void> {
    const showPermission = container.resolve(ShowPermissionService);

    const { id } = request.params;

    const permission = await showPermission.execute(request.dbConnection, id);

    response.status(permission.code).json(permission);
  }
}
