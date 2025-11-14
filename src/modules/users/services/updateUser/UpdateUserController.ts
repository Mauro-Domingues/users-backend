import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IUserDTO } from '@modules/users/dtos/IUserDTO';
import type { User } from '@modules/users/entities/User';
import { UpdateUserService } from './UpdateUserService';

export class UpdateUserController {
  public async handle(
    request: Request<Required<IUserDTO>, never, IUserDTO>,
    response: Response<IResponseDTO<User>>,
  ): Promise<void> {
    const updateUser = container.resolve(UpdateUserService);

    const { id } = request.params;
    const userData = request.body;

    const user = await updateUser.execute(request.dbConnection, id, userData);

    response.status(user.code).json(user);
  }
}
