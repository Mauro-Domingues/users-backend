import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Query, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { ICacheDTO } from '@dtos/ICacheDTO';
import type { IListDTO } from '@dtos/IListDTO';
import type { File } from '@modules/system/entities/File';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/files')
@injectable()
export class ListFileService {
  public constructor(
    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('File')
  public async execute(
    @Inject() connection: IConnection,
    @Query() page: number,
    @Query() limit: number,
    @Inject() filters: Partial<File>,
  ): Promise<IListDTO<File>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:files:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<ICacheDTO<File>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.filesRepository.findAll(
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
        message: 'Successfully listed files',
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
