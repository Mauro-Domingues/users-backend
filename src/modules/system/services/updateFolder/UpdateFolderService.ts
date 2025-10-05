import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import { updateAttribute } from '@utils/mappers';
import { Folder } from '@modules/system/entities/Folder';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Put, Body, Path } from 'tsoa';
import { GenerateSlug } from '@utils/generateSlug';

@Route('/folders')
@injectable()
export class UpdateFolderService {
  private readonly generateSlug: GenerateSlug<IFoldersRepository>;

  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {
    this.generateSlug = new GenerateSlug(this.foldersRepository);
  }

  @Put('{id}')
  @Tags('Folder')
  public async execute(
    @Path() id: string,
    @Body() folderData: IFolderDTO,
  ): Promise<IResponseDTO<Folder>> {
    const trx = this.connection.mysql.createQueryRunner();

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

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:folders`,
      );
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
