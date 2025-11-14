import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import type { Permission } from '@modules/users/entities/Permission';
import type { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IConnection } from '@shared/typeorm';
import { GenerateSlug } from '@utils/generateSlug';
import { slugify } from '@utils/slugify';

@Route('/permissions')
@injectable()
export class CreatePermissionService {
  private readonly generateSlug: GenerateSlug<IPermissionsRepository>;

  public constructor(
    @inject('PermissionsRepository')
    private readonly permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {
    this.generateSlug = new GenerateSlug(this.permissionsRepository);
  }

  @Post()
  @Tags('Permission')
  public async execute(
    @Inject() connection: IConnection,
    @Body() permissionData: IPermissionDTO,
  ): Promise<IResponseDTO<Permission>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      permissionData.slug = `${slugify(permissionData.route)}___${permissionData.method}`;

      const permission = await this.permissionsRepository.create(
        permissionData,
        trx,
      );

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:permissions`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'Permission successfully created',
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
