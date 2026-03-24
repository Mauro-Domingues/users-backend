import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ILogoutDTO } from '@modules/users/dtos/ILogoutDTO';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/logout')
@injectable()
export class LogoutUserService {
  public constructor(
    @inject('TokensRepository')
    private readonly tokensRepository: ITokensRepository,
  ) {}

  @Post()
  @Tags('User')
  public async execute(
    @Inject() connection: IConnection,
    @Body() { deviceId, userId }: ILogoutDTO,
  ): Promise<IResponseDTO<null>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const token = await this.tokensRepository.exists(
        { where: { deviceId, userId } },
        trx,
      );

      if (!token) {
        throw new AppError('NOT_FOUND', 'Session not found', 404);
      }

      await this.tokensRepository.delete({ deviceId, userId }, trx);

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'LOGGED_OUT',
        message: 'User successfully logged out',
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
