import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import type { Folder } from '@modules/system/entities/Folder';
import { CreateFolderService } from './CreateFolderService';

export class CreateFolderController {
  public async handle(
    request: Request<never, never, IFolderDTO>,
    response: Response<IResponseDTO<Folder>>,
  ): Promise<void> {
    const folderData = request.body;

    const createFolder = container.resolve(CreateFolderService);

    const folder = await createFolder.execute(request.dbConnection, folderData);

    response.status(folder.code).json(folder);
  }
}
