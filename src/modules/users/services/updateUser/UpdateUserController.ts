import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { User } from '@modules/users/entities/User';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { UpdateUserService } from './UpdateUserService';

export class UpdateUserController {
  public async handle(
    request: Request<Required<IUserDTO>, never, IUserDTO>,
    response: Response<IResponseDTO<User>>,
  ): Promise<void> {
    const updateUser = container.resolve(UpdateUserService);

    const { id } = request.params;
    const userData = request.body;

    const user = await updateUser.execute(id, userData);

    response.status(user.code).send(user);
  }
}
