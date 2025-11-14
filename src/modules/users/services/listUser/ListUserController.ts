import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IListDTO } from '@dtos/IListDTO';
import type { User } from '@modules/users/entities/User';
import { ListUserService } from './ListUserService';

export class ListUserController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      {
        page: number;
        limit: number;
      } & Partial<User>
    >,
    response: Response<IListDTO<User>>,
  ): Promise<void> {
    const listUser = container.resolve(ListUserService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const users = await listUser.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(users.code).json(users);
  }
}
