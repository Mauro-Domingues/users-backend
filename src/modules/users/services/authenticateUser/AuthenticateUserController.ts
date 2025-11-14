import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import type { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import type { IRefreshTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IRefreshTokenDTO';
import { AuthenticateUserService } from './AuthenticateUserService';

export class AuthenticateUserController {
  public async handle(
    request: Request<never, never, IAuthDTO>,
    response: Response<
      IResponseDTO<{
        jwtToken: IJwtTokenDTO;
        refreshToken: IRefreshTokenDTO;
      }>
    >,
  ): Promise<void> {
    const userData = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const authenticatedUser = await authenticateUser.execute(
      request.dbConnection,
      userData,
    );

    response.status(authenticatedUser.code).json(authenticatedUser);
  }
}
