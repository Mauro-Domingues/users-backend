import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IUserDTO } from '@modules/users/dtos/IUserDTO';
import type { User } from '@modules/users/entities/User';
import { ShowUserService } from './ShowUserService';

export class ShowUserController {
  public async handle(
    request: Request<Required<IUserDTO>>,
    response: Response<IResponseDTO<User>>,
  ): Promise<void> {
    const showUser = container.resolve(ShowUserService);

    const { id } = request.params;

    const user = await showUser.execute(request.dbConnection, id);

    response.status(user.code).json(user);
  }
}
