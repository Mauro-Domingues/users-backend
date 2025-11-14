import { instanceToInstance } from 'class-transformer';
import { Body, Consumes, Inject, Path, Put, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFileDTO } from '@modules/system/dtos/IFileDTO';
import type { File } from '@modules/system/entities/File';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import type { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';
import { updateAttribute } from '@utils/mappers';

@Route('/files')
@injectable()
export class UpdateFileService {
  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Put('{id}')
  @Tags('File')
  @Consumes('multipart/form-data')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() fileData: IFileDTO,
  ): Promise<IResponseDTO<File>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const folder = await this.foldersRepository.findBy(
        {
          where: [
            {
              id: fileData.folderId,
            },
            { slug: 'hidden' },
          ],
          select: { id: true },
        },
        trx,
      );

      if (!folder) {
        throw new AppError('NOT_FOUND', 'Could not resolve folder location');
      }

      const file = await this.filesRepository.findBy({ where: { id } }, trx);

      if (!file) {
        throw new AppError('NOT_FOUND', 'File not found', 404);
      }

      if (fileData.file) {
        if (file.file) await this.storageProvider.deleteFile(file.file);
        await this.storageProvider.saveFile(fileData.file);
      }

      await this.filesRepository.update(
        updateAttribute(file, { ...fileData, folderId: folder.id }),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(`${connection.client}:files`);
      await this.cacheProvider.invalidatePrefix(`${connection.client}:folders`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated file',
        data: instanceToInstance(file),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
