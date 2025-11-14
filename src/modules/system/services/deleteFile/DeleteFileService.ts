import { Delete, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/files')
@injectable()
export class DeleteFileService {
  public constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('File')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const file = await this.filesRepository.findBy(
        {
          where: { id },
          select: {
            file: true,
          },
        },
        trx,
      );

      if (!file) {
        throw new AppError('NOT_FOUND', 'File not found', 404);
      }

      if (file.file) {
        await this.storageProvider.deleteFile(file.file);
      }

      await this.filesRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:files`);
      await this.cacheProvider.invalidatePrefix(`${connection.client}:folders`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted file',
        data: null,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
