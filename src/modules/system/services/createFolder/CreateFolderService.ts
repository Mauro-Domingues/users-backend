import { injectable, inject } from 'tsyringe';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import { Folder } from '@modules/system/entities/Folder';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Post, Body } from 'tsoa';
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

    @inject('Connection')
    private readonly connection: IConnection,
  ) {
    this.generateSlug = new GenerateSlug(this.foldersRepository);
  }

  @Post()
  @Tags('Folder')
  public async execute(
    @Body() folderData: IFolderDTO,
  ): Promise<IResponseDTO<Folder>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      folderData.slug = await this.generateSlug.execute(folderData.name, trx);

      const folder = await this.foldersRepository.create(folderData, trx);

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:folders`,
      );
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
