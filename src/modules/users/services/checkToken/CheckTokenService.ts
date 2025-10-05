import { injectable, inject } from 'tsyringe';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { AppError } from '@shared/errors/AppError';
import { ICryptoProvider } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { QueryRunner } from 'typeorm';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Post, Body } from 'tsoa';
import { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import { ICheckTokenDTO } from '@modules/users/dtos/ICheckTokenDTO';

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

    @inject('Connection')
    private readonly connection: IConnection,
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
    @Body() { email, recoveryCode }: ICheckTokenDTO,
  ): Promise<
    IResponseDTO<{
      jwtToken: IJwtTokenDTO;
    }>
  > {
    const trx = this.connection.mysql.createQueryRunner();

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

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:users`,
      );
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
