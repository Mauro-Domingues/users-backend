import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindOptionsWhere } from 'typeorm';
import { File } from '@modules/system/entities/File';
import { IListDTO } from '@dtos/IListDTO';
import { ListFileService } from './ListFileService';

export class ListFileController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & FindOptionsWhere<File>
    >,
    response: Response<IListDTO<File>>,
  ): Promise<void> {
    const listFile = container.resolve(ListFileService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const files = await listFile.execute(
      request.dbConnection,
      page,
      limit,
      filters,
    );

    response.status(files.code).send(files);
  }
}
