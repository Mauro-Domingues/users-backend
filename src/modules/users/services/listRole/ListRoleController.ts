import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IListDTO } from '@dtos/IListDTO';
import type { Role } from '@modules/users/entities/Role';
import { ListRoleService } from './ListRoleService';

export class ListRoleController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & Partial<Role>
    >,
    response: Response<IListDTO<Role>>,
  ): Promise<void> {
    const listRole = container.resolve(ListRoleService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const roles = await listRole.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(roles.code).json(roles);
  }
}
