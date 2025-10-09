import { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Role } from '@modules/users/entities/Role';
import { CreateRoleService } from './CreateRoleService';

export class CreateRoleController {
  public async handle(
    request: Request<never, never, IRoleDTO>,
    response: Response<IResponseDTO<Role>>,
  ): Promise<void> {
    const roleData = request.body;

    const createRole = container.resolve(CreateRoleService);

    const role = await createRole.execute(request.dbConnection, roleData);

    response.status(role.code).send(role);
  }
}
