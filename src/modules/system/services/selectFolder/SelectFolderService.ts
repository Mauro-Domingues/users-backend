import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Folder } from '@modules/system/entities/Folder';
import type { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/select-folders')
@injectable()
export class SelectFolderService {
  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('Folder')
  public async execute(
    @Inject() connection: IConnection,
    @Inject() filters: Partial<Folder>,
  ): Promise<IResponseDTO<Array<Folder>>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:folders:select:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<Array<Folder>>(cacheKey);

      if (!cache) {
        const { list } = await this.foldersRepository.findAll(
          { where: filters, select: { id: true, name: true } },
          trx,
        );
        cache = instanceToInstance(list);
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LISTED',
        message: 'Successfully listed folders',
        data: cache,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
