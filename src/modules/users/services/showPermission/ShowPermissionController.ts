import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import { Permission } from '@modules/users/entities/Permission';
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
