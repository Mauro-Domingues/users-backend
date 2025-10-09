import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IChangePasswordDTO } from '@modules/users/dtos/IChangePasswordDTO';
import { ChangePasswordService } from './ChangePasswordService';

export class ChangePasswordController {
  public async handle(
    request: Request<never, never, IChangePasswordDTO>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const { id } = { id: request.user?.sub };
    const userData = request.body;

    const changePassword = container.resolve(ChangePasswordService);

    const passwordChanged = await changePassword.execute(
      request.dbConnection,
      id,
      userData,
    );

    response.status(passwordChanged.code).send(passwordChanged);
  }
}
