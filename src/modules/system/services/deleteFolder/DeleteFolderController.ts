import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import { DeleteFolderService } from './DeleteFolderService';

export class DeleteFolderController {
  public async handle(
    request: Request<Required<IFolderDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteFolder = container.resolve(DeleteFolderService);

    const { id } = request.params;

    const folder = await deleteFolder.execute(request.dbConnection, id);

    response.send(folder);
  }
}
