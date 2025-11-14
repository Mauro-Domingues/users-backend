import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import type { Folder } from '@modules/system/entities/Folder';
import type { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';
import { GenerateSlug } from '@utils/generateSlug';

@Route('/folders')
@injectable()
export class CreateFolderService {
  private readonly generateSlug: GenerateSlug<IFoldersRepository>;

  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {
    this.generateSlug = new GenerateSlug(this.foldersRepository);
  }

  @Post()
  @Tags('Folder')
  public async execute(
    @Inject() connection: IConnection,
    @Body() folderData: IFolderDTO,
  ): Promise<IResponseDTO<Folder>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      folderData.slug = await this.generateSlug.execute(folderData.name, trx);

      const folder = await this.foldersRepository.create(folderData, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:folders`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'Folder successfully created',
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
