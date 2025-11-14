import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICreateFileDTO } from '@modules/system/dtos/ICreateFileDTO';
import type { File } from '@modules/system/entities/File';
import { CreateFileService } from './CreateFileService';

export class CreateFileController {
  public async handle(
    request: Request<never, never, ICreateFileDTO>,
    response: Response<IResponseDTO<Array<File>>>,
  ): Promise<void> {
    const createFile = container.resolve(CreateFileService);

    const fileData: ICreateFileDTO = request.body;

    fileData.files ??= [];

    if (request?.files?.length) {
      request.files.forEach(file => {
        return fileData.files.push({
          file: file.filename,
          name: file.originalname,
        });
      });
    }

    const file = await createFile.execute(request.dbConnection, fileData);

    response.status(file.code).json(file);
  }
}
