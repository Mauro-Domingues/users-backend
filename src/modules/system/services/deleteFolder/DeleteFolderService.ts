import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Delete, Path, Inject } from 'tsoa';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';

@Route('/folders')
@injectable()
export class DeleteFolderService {
  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

    @inject('StorageProvider')
    private readonly storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('Folder')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const folder = await this.foldersRepository.findBy(
        {
          where: { id },
          relations: { files: true },
          select: { files: { file: true } },
        },
        trx,
      );

      if (!folder) {
        throw new AppError('NOT_FOUND', 'Folder not found', 404);
      }

      await Promise.allSettled(
        folder.files.map(async image => {
          return this.storageProvider.deleteFile(image.file);
        }),
      );

      await this.foldersRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:folders`);
      await this.cacheProvider.invalidatePrefix(`${connection.client}:files`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted folder',
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
