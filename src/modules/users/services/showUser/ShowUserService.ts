import { instanceToInstance } from 'class-transformer';
import { Get, Inject, Path, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { User } from '@modules/users/entities/User';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/users')
@injectable()
export class ShowUserService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,
  ) {}

  @Get('{id}')
  @Tags('User')
  public async execute(
    @Inject() connection: IConnection,
    @Path() id: string,
  ): Promise<IResponseDTO<User>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const user = await this.usersRepository.findBy(
        {
          where: { id },
          relations: {
            profile: {
              avatar: true,
            },
            address: true,
          },
          select: {
            profile: {
              avatar: { file: true },
              cpf: true,
              birthday: true,
              fullName: true,
              phone: true,
              id: true,
            },
            address: {
              complement: true,
              district: true,
              zipcode: true,
              number: true,
              street: true,
              city: true,
              uf: true,
              id: true,
            },
            email: true,
            id: true,
          },
        },
        trx,
      );

      if (!user) {
        throw new AppError('NOT_FOUND', 'User not found', 404);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'FOUND',
        message: 'User found successfully',
        data: instanceToInstance(user),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
