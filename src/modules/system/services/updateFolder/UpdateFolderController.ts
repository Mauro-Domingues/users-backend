import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import type { Folder } from '@modules/system/entities/Folder';
import { UpdateFolderService } from './UpdateFolderService';

export class UpdateFolderController {
  public async handle(
    request: Request<Required<IFolderDTO>, never, IFolderDTO>,
    response: Response<IResponseDTO<Folder>>,
  ): Promise<void> {
    const updateFolder = container.resolve(UpdateFolderService);

    const { id } = request.params;
    const folderData = request.body;

    const folder = await updateFolder.execute(
      request.dbConnection,
      id,
      folderData,
    );

    response.status(folder.code).json(folder);
  }
}
