import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { ICacheDTO } from '@dtos/ICacheDTO';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { User } from '@modules/users/entities/User';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/select-users')
@injectable()
export class SelectUserService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('User')
  public async execute(
    @Inject() connection: IConnection,
    @Inject() filters: Partial<User>,
  ): Promise<IResponseDTO<Array<User>>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:users:select:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<ICacheDTO<User>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.usersRepository.findAll(
          {
            where: filters,
            relations: { profile: true },
            select: {
              id: true,
              email: true,
              profile: { fullName: true },
            },
          },
          trx,
        );
        cache = { data: instanceToInstance(list), total: amount };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LISTED',
        message: 'Successfully listed users',
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
