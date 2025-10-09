import { injectable, inject } from 'tsyringe';

import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import { updateAttribute } from '@utils/mappers';
import { Permission } from '@modules/users/entities/Permission';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Put, Body, Path, Inject } from 'tsoa';

@Route('/permissions')
@injectable()
export class UpdatePermissionService {
  public constructor(
    @inject('PermissionsRepository')
    private readonly permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Put('{id}')
  @Tags('Permission')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() permissionData: IPermissionDTO,
  ): Promise<IResponseDTO<Permission>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const permission = await this.permissionsRepository.findBy(
        {
          where: { id },
          select: { id: true, name: true, description: true },
        },
        trx,
      );

      if (!permission) {
        throw new AppError(
          'NOT_FOUND',
          `Permission not found with id: "${id}"`,
          404,
        );
      }

      await this.permissionsRepository.update(
        updateAttribute(permission, permissionData),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:permissions`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated permission',
        data: instanceToInstance(permission),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
