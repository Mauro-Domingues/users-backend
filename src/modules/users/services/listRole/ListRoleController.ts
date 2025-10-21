import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindOptionsWhere } from 'typeorm';
import { Role } from '@modules/users/entities/Role';
import { IListDTO } from '@dtos/IListDTO';
import { ListRoleService } from './ListRoleService';

export class ListRoleController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & FindOptionsWhere<Role>
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
