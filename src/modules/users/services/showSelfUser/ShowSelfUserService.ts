import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { User } from '@modules/users/entities/User';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { instanceToInstance } from 'class-transformer';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IConnection } from '@shared/typeorm';
import { Get, Route, Tags, Inject } from 'tsoa';

@Route('/me')
@injectable()
export class ShowSelfUserService {
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
    @Inject() id: string,
  ): Promise<IResponseDTO<User>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${connection.client}:users:${id}`;

      let cache = await this.cacheProvider.recovery<{ data: User }>(cacheKey);

      if (!cache) {
        const user = await this.usersRepository.findBy(
          {
            where: { id },
            relations: {
              profile: {
                avatar: true,
              },
              address: true,
            },
            select: {
              profile: {
                avatar: { file: true },
                cpf: true,
                birthday: true,
                fullName: true,
                phone: true,
                id: true,
              },
              address: {
                complement: true,
                district: true,
                zipcode: true,
                number: true,
                street: true,
                city: true,
                uf: true,
                id: true,
              },
              email: true,
              id: true,
            },
          },
          trx,
        );

        if (!user) {
          throw new AppError('NOT_FOUND', 'User not found', 404);
        }

        cache = {
          data: instanceToInstance(user),
        };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'User found successfully',
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
