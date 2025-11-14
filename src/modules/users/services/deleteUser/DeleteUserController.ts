import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { DeleteUserService } from './DeleteUserService';

export class DeleteUserController {
  public async handle(
    request: Request<Required<IUserDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteUser = container.resolve(DeleteUserService);

    const { id } = request.params;

    const user = await deleteUser.execute(request.dbConnection, id);

    response.sendStatus(user.code);
  }
}
