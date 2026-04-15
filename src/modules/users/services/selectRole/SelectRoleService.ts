import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Role } from '@modules/users/entities/Role';
import type { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';

@Route('/select-roles')
@injectable()
export class SelectRoleService {
  public constructor(
    @inject('RolesRepository')
    private readonly rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Get()
  @Tags('Role')
  public async execute(
    @Inject() connection: IConnection,
    @Inject() filters: Partial<Role>,
  ): Promise<IResponseDTO<Array<Role>>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        connection.client
      }:roles:select:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<Array<Role>>(cacheKey);

      if (!cache) {
        const { list } = await this.rolesRepository.findAll(
          {
            where: filters,
            select: { id: true, name: true },
          },
          trx,
        );
        cache = instanceToInstance(list);
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LISTED',
        message: 'Successfully listed roles',
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
