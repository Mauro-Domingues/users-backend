import { injectable, inject } from 'tsyringe';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { File } from '@modules/system/entities/File';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { AppError } from '@shared/errors/AppError';
import { ICreateFileDTO } from '@modules/system/dtos/ICreateFileDTO';
import { IFileDTO } from '@modules/system/dtos/IFileDTO';
import { Route, Tags, Post, Body, Consumes, Inject } from 'tsoa';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@Route('/files')
@injectable()
export class CreateFileService {
  public constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepository,

    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

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
        throw new AppError(
          'CAN_NOT_RESOLVE_RELATION',
          'Could not resolve folder location',
        );
      }

      const fileDataArray: Array<IFileDTO> = [];
      const createdFiles: Array<string> = [];

      await Promise.all(
        fileData.files.map(async file => {
          fileDataArray.push({
            folderId: folder.id,
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
      await this.cacheProvider.invalidatePrefix(`${connection.client}:folders`);

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
