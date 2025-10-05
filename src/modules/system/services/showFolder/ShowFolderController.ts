import { Folder } from '@modules/system/entities/Folder';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import { ShowFolderService } from './ShowFolderService';

export class ShowFolderController {
  public async handle(
    request: Request<Required<IFolderDTO>>,
    response: Response<IResponseDTO<Folder>>,
  ): Promise<void> {
    const showFolder = container.resolve(ShowFolderService);

    const { id } = request.params;

    const folder = await showFolder.execute(id);

    response.status(folder.code).send(folder);
  }
}
