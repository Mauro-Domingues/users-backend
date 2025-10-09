import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { convertToMilliseconds } from '@utils/convertToMilliseconds';
import { cryptoConfig } from '@config/crypto';
import { ISocialAuthDTO } from '@modules/users/dtos/ISocialAuthDTO';
import { SocialAuthenticateUserService } from './SocialAuthenticateUserService';

export class SocialAuthenticateUserController {
  public async handle(
    request: Request<never, never, never, { state: string }>,
    response: Response<never>,
  ): Promise<void> {
    const userData: ISocialAuthDTO = {
      email: request?.user?.email,
      isAuthenticated: request.isAuthenticated(),
    };

    const authenticateUser = container.resolve(SocialAuthenticateUserService);

    const {
      data: {
        jwtToken: { expiresIn, token: jwtToken },
        refreshToken: { token: refreshToken },
      },
    } = await authenticateUser.execute(request.dbConnection, userData);

    response.cookie('jwtToken', jwtToken, {
      maxAge: expiresIn,
      priority: 'high',
      sameSite: true,
      httpOnly: true,
      secure: true,
      path: '/',
    });
    response.cookie('refreshToken', refreshToken, {
      priority: 'high',
      sameSite: true,
      httpOnly: true,
      secure: true,
      path: '/',
      maxAge:
        convertToMilliseconds(cryptoConfig.config.crypto.jwtLifetime) +
        convertToMilliseconds('1d'),
    });
    response.redirect(request.query.state);
  }
}
