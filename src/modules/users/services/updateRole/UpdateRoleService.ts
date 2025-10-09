import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import { updateAttribute } from '@utils/mappers';
import { Role } from '@modules/users/entities/Role';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Put, Body, Path, Inject } from 'tsoa';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';

@Route('/roles')
@injectable()
export class UpdateRoleService {
  public constructor(
    @inject('RolesRepository')
    private readonly rolesRepository: IRolesRepository,

    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Put('{id}')
  @Tags('Role')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() roleData: IRoleDTO,
  ): Promise<IResponseDTO<Role>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const role = await this.rolesRepository.findBy(
        {
          where: { id },
          relations: { users: true },
          select: {
            id: true,
            name: true,
            description: true,
            users: { id: !!roleData.permissions?.length },
          },
        },
        trx,
      );

      if (!role) {
        throw new AppError('NOT_FOUND', `Role not found with id: "${id}"`, 404);
      }

      if (roleData.permissions?.length) {
        role.users.forEach(user => {
          user.permissions = roleData.permissions!;
        });
        await this.usersRepository.updateMany(role.users, trx);

        await this.cacheProvider.invalidatePrefix(`${connection.client}:users`);
      }

      await this.rolesRepository.update(updateAttribute(role, roleData), trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:roles`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated role',
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
