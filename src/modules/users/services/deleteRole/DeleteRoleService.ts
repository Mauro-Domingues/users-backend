import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Delete, Path, Inject } from 'tsoa';

@Route('/roles')
@injectable()
export class DeleteRoleService {
  public constructor(
    @inject('RolesRepository')
    private readonly rolesRepository: IRolesRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  @Delete('{id}')
  @Tags('Role')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const role = await this.rolesRepository.exists({ where: { id } }, trx);

      if (!role) {
        throw new AppError('NOT_FOUND', `Role not found with id: "${id}"`, 404);
      }

      await this.rolesRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:roles`);
      await this.cacheProvider.invalidatePrefix(`${connection.client}:users`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'DELETED',
        message: 'Successfully deleted role',
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
