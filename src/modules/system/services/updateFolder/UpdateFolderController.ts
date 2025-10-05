import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import { Folder } from '@modules/system/entities/Folder';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { UpdateFolderService } from './UpdateFolderService';

export class UpdateFolderController {
  public async handle(
    request: Request<Required<IFolderDTO>, never, IFolderDTO>,
    response: Response<IResponseDTO<Folder>>,
  ): Promise<void> {
    const updateFolder = container.resolve(UpdateFolderService);

    const { id } = request.params;
    const folderData = request.body;

    const folder = await updateFolder.execute(id, folderData);

    response.status(folder.code).send(folder);
  }
}
