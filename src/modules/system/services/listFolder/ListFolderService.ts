import { injectable, inject } from 'tsyringe';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Folder } from '@modules/system/entities/Folder';
import { instanceToInstance } from 'class-transformer';
import { ICacheDTO } from '@dtos/ICacheDTO';
import { IListDTO } from '@dtos/IListDTO';
import { IConnection } from '@shared/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Get, Route, Tags, Query, Inject } from 'tsoa';

@Route('/folders')
@injectable()
export class ListFolderService {
  public constructor(
    @inject('FoldersRepository')
    private readonly foldersRepository: IFoldersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {}

  @Get()
  @Tags('Folder')
  public async execute(
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: FindOptionsWhere<Folder>,
  ): Promise<IListDTO<Folder>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        this.connection.client
      }:folders:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache =
        await this.cacheProvider.recovery<ICacheDTO<Folder>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.foldersRepository.findAll(
          { where: filters, page, limit, select: { id: true, name: true } },
          trx,
        );
        cache = { data: instanceToInstance(list), total: amount };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LISTED',
        message: 'Successfully listed folders',
        pagination: {
          total: cache.total,
          page,
          perPage: limit,
          lastPage: Math.ceil(cache.total / limit),
        },
        data: cache.data,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
