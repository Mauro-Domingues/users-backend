import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import type { Role } from '@modules/users/entities/Role';
import { CreateRoleService } from './CreateRoleService';

export class CreateRoleController {
  public async handle(
    request: Request<never, never, IRoleDTO>,
    response: Response<IResponseDTO<Role>>,
  ): Promise<void> {
    const roleData = request.body;

    const createRole = container.resolve(CreateRoleService);

    const role = await createRole.execute(request.dbConnection, roleData);

    response.status(role.code).json(role);
  }
}
