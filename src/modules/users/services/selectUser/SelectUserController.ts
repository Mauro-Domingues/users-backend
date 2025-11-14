import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { User } from '@modules/users/entities/User';
import { SelectUserService } from './SelectUserService';

export class SelectUserController {
  public async handle(
    request: Request<never, never, never, Partial<User>>,
    response: Response<IResponseDTO<Array<User>>>,
  ): Promise<void> {
    const selectUser = container.resolve(SelectUserService);

    const filters = request.query;

    const users = await selectUser.execute(request.dbConnection, filters);

    response.status(users.code).json(users);
  }
}
