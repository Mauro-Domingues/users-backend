import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { Permission } from '@modules/users/entities/Permission';
import type { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/permissions')
@injectable()
export class ShowPermissionService {
  public constructor(
    @inject('PermissionsRepository')
    private readonly permissionsRepository: IPermissionsRepository,
  ) {}

  @Get('{id}')
  @Tags('Permission')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
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

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'Permission found successfully',
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
