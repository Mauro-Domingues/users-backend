import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import { Role } from '@modules/users/entities/Role';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { UpdateRoleService } from './UpdateRoleService';

export class UpdateRoleController {
  public async handle(
    request: Request<Required<IRoleDTO>, never, IRoleDTO>,
    response: Response<IResponseDTO<Role>>,
  ): Promise<void> {
    const updateRole = container.resolve(UpdateRoleService);

    const { id } = request.params;
    const roleData = request.body;

    const role = await updateRole.execute(request.dbConnection, id, roleData);

    response.status(role.code).json(role);
  }
}
