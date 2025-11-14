import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import type { Role } from '@modules/users/entities/Role';
import { ShowRoleService } from './ShowRoleService';

export class ShowRoleController {
  public async handle(
    request: Request<Required<IRoleDTO>>,
    response: Response<IResponseDTO<Role>>,
  ): Promise<void> {
    const showRole = container.resolve(ShowRoleService);

    const { id } = request.params;

    const role = await showRole.execute(request.dbConnection, id);

    response.status(role.code).json(role);
  }
}
