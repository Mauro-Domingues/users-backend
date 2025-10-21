import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindOptionsWhere } from 'typeorm';
import { User } from '@modules/users/entities/User';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { SelectUserService } from './SelectUserService';

export class SelectUserController {
  public async handle(
    request: Request<never, never, never, FindOptionsWhere<User>>,
    response: Response<IResponseDTO<Array<User>>>,
  ): Promise<void> {
    const selectUser = container.resolve(SelectUserService);

    const filters = request.query;

    const users = await selectUser.execute(request.dbConnection, filters);

    response.status(users.code).json(users);
  }
}
