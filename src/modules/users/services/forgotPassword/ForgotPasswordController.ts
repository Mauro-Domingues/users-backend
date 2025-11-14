import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IForgotPasswordDTO } from '@modules/users/dtos/IForgotPasswordDTO';
import { ForgotPasswordService } from './ForgotPasswordService';

export class ForgotPasswordController {
  public async handle(
    request: Request<never, never, IForgotPasswordDTO>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const userData = request.body;

    const forgotPassword = container.resolve(ForgotPasswordService);

    const passwordForgotten = await forgotPassword.execute(
      request.dbConnection,
      userData,
    );

    response.sendStatus(passwordForgotten.code);
  }
}
