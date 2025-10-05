import { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import { IRefreshTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IRefreshTokenDTO';
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

    const authenticatedUser = await authenticateUser.execute(userData);

    response.status(authenticatedUser.code).send(authenticatedUser);
  }
}
