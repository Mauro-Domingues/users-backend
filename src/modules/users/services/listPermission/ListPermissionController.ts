import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindOptionsWhere } from 'typeorm';
import { Permission } from '@modules/users/entities/Permission';
import { IListDTO } from '@dtos/IListDTO';
import { ListPermissionService } from './ListPermissionService';

export class ListPermissionController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & FindOptionsWhere<Permission>
    >,
    response: Response<IListDTO<Permission>>,
  ): Promise<void> {
    const listPermission = container.resolve(ListPermissionService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const permissions = await listPermission.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(permissions.code).json(permissions);
  }
}
