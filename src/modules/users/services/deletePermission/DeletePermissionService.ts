import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Delete, Path, Inject } from 'tsoa';

@Route('/permissions')
@injectable()
export class DeletePermissionService {
  public constructor(
    @inject('PermissionsRepository')
    private readonly permissionsRepository: IPermissionsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('Permission')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const permission = await this.permissionsRepository.exists(
        { where: { id } },
        trx,
      );

      if (!permission) {
        throw new AppError(
          'NOT_FOUND',
          `Permission not found with id: "${id}"`,
          404,
        );
      }

      await this.permissionsRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(
        `${connection.client}:permissions`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted permission',
        data: null,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
