import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ILogoutDTO } from '@modules/users/dtos/ILogoutDTO';
import { LogoutUserService } from './LogoutUserService';

export class LogoutUserController {
  public async handle(
    request: Request<never, never, ILogoutDTO>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const userData = request.body;
    userData.userId = request.user?.sub;

    const logoutUser = container.resolve(LogoutUserService);

    const loggedOutUser = await logoutUser.execute(
      request.dbConnection,
      userData,
    );

    response.status(loggedOutUser.code).json(loggedOutUser);
  }
}
