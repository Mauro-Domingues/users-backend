import type { Request, Response } from 'express';
import { container } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFileDTO } from '@modules/system/dtos/IFileDTO';
import { DeleteFileService } from './DeleteFileService';

export class DeleteFileController {
  public async handle(
    request: Request<Required<IFileDTO>>,
    response: Response<IResponseDTO<null>>,
  ): Promise<void> {
    const deleteFile = container.resolve(DeleteFileService);

    const { id } = request.params;

    const file = await deleteFile.execute(request.dbConnection, id);

    response.sendStatus(file.code);
  }
}
