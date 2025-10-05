import { File } from '@modules/system/entities/File';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IFileDTO } from '@modules/system/dtos/IFileDTO';
import { ShowFileService } from './ShowFileService';

export class ShowFileController {
  public async handle(
    request: Request<Required<IFileDTO>>,
    response: Response<IResponseDTO<File>>,
  ): Promise<void> {
    const showFile = container.resolve(ShowFileService);

    const { id } = request.params;

    const file = await showFile.execute(id);

    response.status(file.code).send(file);
  }
}
