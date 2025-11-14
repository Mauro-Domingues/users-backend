import { Body, Inject, Patch, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IChangePasswordDTO } from '@modules/users/dtos/IChangePasswordDTO';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/change-password')
@injectable()
export class ChangePasswordService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,
  ) {}

  @Patch()
  @Tags('User')
  public async execute(
    @Inject() connection: IConnection,
    @Inject() id: string,
    @Body() { password }: IChangePasswordDTO,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const user = await this.usersRepository.findBy(
        {
          where: {
            id,
          },
        },
        trx,
      );

      if (!user) {
        throw new AppError('NOT_FOUND', 'User not found', 404);
      }

      user.password = await this.hashProvider.generateHash(password);

      await this.usersRepository.update(user, trx);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        messageCode: 'UPDATED',
        message: 'Successfully changed password',
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
