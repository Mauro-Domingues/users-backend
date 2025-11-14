import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import type { Permission } from '@modules/users/entities/Permission';
import { CreatePermissionService } from './CreatePermissionService';

export class CreatePermissionController {
  public async handle(
    request: Request<never, never, IPermissionDTO>,
    response: Response<IResponseDTO<Permission>>,
  ): Promise<void> {
    const permissionData = request.body;

    const createPermission = container.resolve(CreatePermissionService);

    const permission = await createPermission.execute(
      request.dbConnection,
      permissionData,
    );

    response.status(permission.code).json(permission);
  }
}
