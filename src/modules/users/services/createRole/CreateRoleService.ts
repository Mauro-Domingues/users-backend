import { injectable, inject } from 'tsyringe';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import { Role } from '@modules/users/entities/Role';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Post, Body, Inject } from 'tsoa';

@Route('/roles')
@injectable()
export class CreateRoleService {
  public constructor(
    @inject('RolesRepository')
    private readonly rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Post()
  @Tags('Role')
  public async execute(
    @Inject() connection: IConnection,
    @Body() roleData: IRoleDTO,
  ): Promise<IResponseDTO<Role>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const role = await this.rolesRepository.create(roleData, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:roles`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'Role successfully created',
        data: instanceToInstance(role),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
