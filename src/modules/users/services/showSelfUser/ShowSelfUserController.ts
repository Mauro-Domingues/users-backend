import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { User } from '@modules/users/entities/User';
import { ShowSelfUserService } from './ShowSelfUserService';

export class ShowSelfUserController {
  public async handle(
    request: Request,
    response: Response<IResponseDTO<User>>,
  ) {
    const showSelfUser = container.resolve(ShowSelfUserService);

    const { id } = { id: request.user?.sub };

    const user = await showSelfUser.execute(request.dbConnection, id);

    response.status(user.code).json(user);
  }
}
