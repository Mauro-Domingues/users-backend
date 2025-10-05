import { injectable, inject } from 'tsyringe';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { AppError } from '@shared/errors/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { ICryptoProvider } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import { QueryRunner } from 'typeorm';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Get, Inject } from 'tsoa';
import { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import { IRefreshTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IRefreshTokenDTO';
import { ISocialAuthDTO } from '@modules/users/dtos/ISocialAuthDTO';

@Route('/auth/callback')
@injectable()
export class SocialAuthenticateUserService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('TokensRepository')
    private readonly tokensRepository: ITokensRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,

    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptoProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {}

  private async generateByEmail({
    isAuthenticated,
    email,
    trx,
  }: {
    email?: string;
    isAuthenticated: boolean;
    trx: QueryRunner;
  }): Promise<{
    jwtToken: IJwtTokenDTO;
    refreshToken: IRefreshTokenDTO;
  }> {
    const checkUser = await this.usersRepository.findBy(
      {
        where: {
          email,
        },
        select: { id: true },
      },
      trx,
    );

    if (!checkUser || !isAuthenticated) {
      throw new AppError(
        'FORBIDDEN',
        'You do not have access to this route',
        403,
      );
    }

    const jwtToken = this.cryptoProvider.generateJwtToken(
      {},
      {
        subject: checkUser.id,
      },
    );

    const refreshToken = this.cryptoProvider.generateRefreshToken(checkUser.id);

    const checkToken = await this.tokensRepository.findBy(
      {
        where: {
          userId: checkUser.id,
        },
        select: { id: true },
      },
      trx,
    );

    if (!checkToken) {
      await this.tokensRepository.create(
        {
          userId: checkUser.id,
          token: refreshToken.token,
        },
        trx,
      );
    } else {
      await this.tokensRepository.update(
        { ...checkToken, token: refreshToken.token },
        trx,
      );
    }

    return { jwtToken, refreshToken };
  }

  @Get()
  @Tags('User')
  public async execute(
    @Inject() { email, isAuthenticated }: ISocialAuthDTO,
  ): Promise<
    IResponseDTO<{
      jwtToken: IJwtTokenDTO;
      refreshToken: IRefreshTokenDTO;
    }>
  > {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const tokens = await this.generateByEmail({
        trx,
        email,
        isAuthenticated,
      });

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'AUTHENTICATED',
        message: 'Successfully authenticated user',
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
