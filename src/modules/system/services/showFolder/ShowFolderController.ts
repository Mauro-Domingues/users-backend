import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import type { Folder } from '@modules/system/entities/Folder';
import { ShowFolderService } from './ShowFolderService';

export class ShowFolderController {
  public async handle(
    request: Request<Required<IFolderDTO>>,
    response: Response<IResponseDTO<Folder>>,
  ): Promise<void> {
    const showFolder = container.resolve(ShowFolderService);

    const { id } = request.params;

    const folder = await showFolder.execute(request.dbConnection, id);

    response.status(folder.code).json(folder);
  }
}
