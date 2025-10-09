import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import { ICheckTokenDTO } from '@modules/users/dtos/ICheckTokenDTO';
import { CheckTokenService } from './CheckTokenService';

export class CheckTokenController {
  public async handle(
    request: Request<never, never, ICheckTokenDTO>,
    response: Response<
      IResponseDTO<{
        jwtToken: IJwtTokenDTO;
      }>
    >,
  ): Promise<void> {
    const tokenData = request.body;

    const checkToken = container.resolve(CheckTokenService);

    const authenticationTokens = await checkToken.execute(
      request.dbConnection,
      tokenData,
    );

    response.status(authenticationTokens.code).send(authenticationTokens);
  }
}
