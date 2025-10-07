import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import { DeleteRoleService } from './DeleteRoleService';

export class DeleteRoleController {
  public async handle(
    request: Request<Required<IRoleDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteRole = container.resolve(DeleteRoleService);

    const { id } = request.params;

    const role = await deleteRole.execute(id);

    response.send(role);
  }
}
