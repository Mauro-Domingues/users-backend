import { instanceToInstance } from 'class-transformer';
import { Body, Consumes, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICreateFileDTO } from '@modules/system/dtos/ICreateFileDTO';
import type { IFileDTO } from '@modules/system/dtos/IFileDTO';
import type { File } from '@modules/system/entities/File';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/files')
@injectable()
export class CreateFileService {
  public constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Post()
  @Tags('File')
  @Consumes('multipart/form-data')
  public async execute(
    @Inject() connection: IConnection,
    @Body() fileData: ICreateFileDTO,
  ): Promise<IResponseDTO<Array<File>>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const fileDataArray: Array<IFileDTO> = [];
      const createdFiles: Array<string> = [];

      await Promise.all(
        fileData.files.map(async file => {
          fileDataArray.push({
            folderId: fileData.folderId,
            file: file.file,
            name: file.name,
          });
          await this.storageProvider.saveFile(file.file);
          createdFiles.push(file.file);
        }),
      ).catch(async (error: unknown) => {
        await Promise.allSettled(
          createdFiles.map(async file => {
            await this.storageProvider.deleteFile(file);
          }),
        );
        throw error;
      });

      const files = await this.filesRepository.createMany(fileDataArray, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:files`);
      if (fileData.folderId) {
        await this.cacheProvider.invalidatePrefix(
          `${connection.client}:folders`,
        );
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'File successfully created',
        data: instanceToInstance(files),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
