import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Path, Put, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import type { Folder } from '@modules/system/entities/Folder';
import type { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';
import { GenerateSlug } from '@utils/generateSlug';
import { updateAttribute } from '@utils/mappers';

@Route('/folders')
@injectable()
export class UpdateFolderService {
  private readonly generateSlug: GenerateSlug<IFoldersRepository>;

  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {
    this.generateSlug = new GenerateSlug(this.foldersRepository);
  }

  @Put('{id}')
  @Tags('Folder')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() folderData: IFolderDTO,
  ): Promise<IResponseDTO<Folder>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const folder = await this.foldersRepository.findBy(
        { where: { id } },
        trx,
      );

      if (!folder) {
        throw new AppError('NOT_FOUND', 'Folder not found', 404);
      }

      if (folderData.name && folder.name !== folderData.name) {
        folderData.slug = await this.generateSlug.execute(folderData.name, trx);
      }

      await this.foldersRepository.update(
        updateAttribute(folder, folderData),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(`${connection.client}:folders`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated folder',
        data: instanceToInstance(folder),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
