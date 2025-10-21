import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import { Permission } from '@modules/users/entities/Permission';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { UpdatePermissionService } from './UpdatePermissionService';

export class UpdatePermissionController {
  public async handle(
    request: Request<Required<IPermissionDTO>, never, IPermissionDTO>,
    response: Response<IResponseDTO<Permission>>,
  ): Promise<void> {
    const updatePermission = container.resolve(UpdatePermissionService);

    const { id } = request.params;
    const permissionData = request.body;

    const permission = await updatePermission.execute(
      request.dbConnection,
      id,
      permissionData,
    );

    response.status(permission.code).json(permission);
  }
}
