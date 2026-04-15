import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Role } from '@modules/users/entities/Role';
import { SelectRoleService } from './SelectRoleService';

export class SelectRoleController {
  public async handle(
    request: Request<never, never, never, Partial<Role>>,
    response: Response<IResponseDTO<Array<Role>>>,
  ): Promise<void> {
    const listRole = container.resolve(SelectRoleService);

    const filters = request.query;

    const roles = await listRole.execute(request.dbConnection, filters);

    response.status(roles.code).json(roles);
  }
}
