import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Folder } from '@modules/system/entities/Folder';
import { SelectFolderService } from './SelectFolderService';

export class SelectFolderController {
  public async handle(
    request: Request<never, never, never, Partial<Folder>>,
    response: Response<IResponseDTO<Array<Folder>>>,
  ): Promise<void> {
    const listFolder = container.resolve(SelectFolderService);

    const filters = request.query;

    const folders = await listFolder.execute(request.dbConnection, filters);

    response.status(folders.code).json(folders);
  }
}
