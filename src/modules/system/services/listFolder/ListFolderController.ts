import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IListDTO } from '@dtos/IListDTO';
import type { Folder } from '@modules/system/entities/Folder';
import { ListFolderService } from './ListFolderService';

export class ListFolderController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & Partial<Folder>
    >,
    response: Response<IListDTO<Folder>>,
  ): Promise<void> {
    const listFolder = container.resolve(ListFolderService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const folders = await listFolder.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(folders.code).json(folders);
  }
}
