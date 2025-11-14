import { Delete, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

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

      if (folder.files?.length) {
        await Promise.allSettled(
          folder.files.map(async image => {
            return this.storageProvider.deleteFile(image.file);
          }),
        );
        await this.cacheProvider.invalidatePrefix(`${connection.client}:files`);
      }

      await this.foldersRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:folders`);

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
