import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ICheckTokenDTO } from '@modules/users/dtos/ICheckTokenDTO';
import type { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import type { ICryptoProvider } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/check-token')
@injectable()
export class CheckTokenService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('PasswordResetsRepository')
    private readonly passwordResetsRepository: IPasswordResetsRepository,

    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptoProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private async generateByEmail({
    email,
    trx,
  }: {
    trx: QueryRunner;
    email: string;
  }): Promise<{
    jwtToken: IJwtTokenDTO;
  }> {
    const checkUser = await this.usersRepository.findBy(
      {
        where: {
          email,
        },
        select: { id: true, password: true },
      },
      trx,
    );

    if (!checkUser) {
      throw new AppError(
        'INVALID_LOGIN_DATA',
        'Invalid email/password combination',
        401,
      );
    }

    const jwtToken = this.cryptoProvider.generateJwtToken(
      {},
      {
        subject: checkUser.id,
      },
    );

    return { jwtToken };
  }

  @Post()
  @Tags('User')
  public async execute(
    @Inject() connection: IConnection,
    @Body() { email, recoveryCode }: ICheckTokenDTO,
  ): Promise<
    IResponseDTO<{
      jwtToken: IJwtTokenDTO;
    }>
  > {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const checkRecoveryCode = await this.passwordResetsRepository.exists(
        {
          where: {
            email,
            recoveryCode,
          },
        },
        trx,
      );

      if (!checkRecoveryCode) {
        throw new AppError('INVALID_TOKEN', 'This token expired', 401);
      }

      const tokens = await this.generateByEmail({ trx, email });

      await this.cacheProvider.invalidatePrefix(`${connection.client}:users`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'AUTHENTICATED',
        message: 'Successfully validated token',
        data: tokens,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
