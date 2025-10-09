import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { Permission } from '@modules/users/entities/Permission';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Get, Route, Tags, Path, Inject } from 'tsoa';

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
