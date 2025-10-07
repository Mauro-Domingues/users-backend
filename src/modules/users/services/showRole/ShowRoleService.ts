import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { Role } from '@modules/users/entities/Role';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Get, Route, Tags, Path } from 'tsoa';

@Route('/roles')
@injectable()
export class ShowRoleService {
  public constructor(
    @inject('RolesRepository')
    private readonly rolesRepository: IRolesRepository,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {}

  @Get('{id}')
  @Tags('Role')
  public async execute(@Path() id: string): Promise<IResponseDTO<Role>> {
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

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'Role found successfully',
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
