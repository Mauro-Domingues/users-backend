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
import { Route, Tags, Put, Body, Path } from 'tsoa';

@Route('/roles')
@injectable()
export class UpdateRoleService {
  public constructor(
    @inject('RolesRepository')
    private readonly rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {}

  @Put('{id}')
  @Tags('Role')
  public async execute(
    @Path() id: string,
    @Body() roleData: IRoleDTO,
  ): Promise<IResponseDTO<Role>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const role = await this.rolesRepository.findBy(
        {
          where: { id },
          select: { id: true, name: true, description: true },
        },
        trx,
      );

      if (!role) {
        throw new AppError(
          'NOT_FOUND',
          `Role not found with id: "${id}"`,
          404,
        );
      }

      await this.rolesRepository.update(
        updateAttribute(role, roleData),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:roles`,
      );
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
