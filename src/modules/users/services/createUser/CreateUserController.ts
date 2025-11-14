import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IUserDTO } from '@modules/users/dtos/IUserDTO';
import type { User } from '@modules/users/entities/User';
import { CreateUserService } from './CreateUserService';

export class CreateUserController {
  public async handle(
    request: Request<never, never, IUserDTO>,
    response: Response<IResponseDTO<User>>,
  ): Promise<void> {
    const userData = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute(request.dbConnection, userData);

    response.status(user.code).json(user);
  }
}
