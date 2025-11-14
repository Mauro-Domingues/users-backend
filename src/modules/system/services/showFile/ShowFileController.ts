import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFileDTO } from '@modules/system/dtos/IFileDTO';
import type { File } from '@modules/system/entities/File';
import { ShowFileService } from './ShowFileService';

export class ShowFileController {
  public async handle(
    request: Request<Required<IFileDTO>>,
    response: Response<IResponseDTO<File>>,
  ): Promise<void> {
    const showFile = container.resolve(ShowFileService);

    const { id } = request.params;

    const file = await showFile.execute(request.dbConnection, id);

    response.status(file.code).json(file);
  }
}
