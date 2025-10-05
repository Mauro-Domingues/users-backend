import { injectable, inject } from 'tsyringe';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { AppError } from '@shared/errors/AppError';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { ICryptoProvider } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import { QueryRunner } from 'typeorm';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Post, Body } from 'tsoa';
import { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import { IRefreshTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IRefreshTokenDTO';

@Route('/login')
@injectable()
export class AuthenticateUserService {
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

  private async generateByToken({
    refreshToken,
    trx,
  }: {
    refreshToken: string;
    trx: QueryRunner;
  }): Promise<{
    jwtToken: IJwtTokenDTO;
    refreshToken: IRefreshTokenDTO;
  }> {
    const token = await this.tokensRepository.findBy(
      {
        where: {
          token: refreshToken,
        },
        select: { id: true, userId: true },
      },
      trx,
    );

    if (!token) {
      throw new AppError('INVALID_TOKEN', 'Invalid token', 401);
    }

    const jwtToken = this.cryptoProvider.generateJwtToken(
      {},
      {
        subject: token.userId,
      },
    );

    const newRefreshToken = this.cryptoProvider.generateRefreshToken(
      token.userId,
    );

    await this.tokensRepository.update(
      { ...token, token: newRefreshToken.token },
      trx,
    );

    return { jwtToken, refreshToken: newRefreshToken };
  }

  private async generateByEmail({
    password,
    email,
    trx,
  }: {
    email: string;
    password: string;
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
        select: { id: true, password: !!password },
      },
      trx,
    );

    if (!checkUser || !password) {
      throw new AppError(
        'INVALID_LOGIN_DATA',
        'Invalid email/password combination',
        401,
      );
    }

    const checkPassword = await this.hashProvider.compareHash(
      password,
      checkUser.password,
    );

    if (!checkPassword) {
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

  @Post()
  @Tags('User')
  public async execute(
    @Body() { email, password, refreshToken }: IAuthDTO,
  ): Promise<
    IResponseDTO<{
      jwtToken: IJwtTokenDTO;
      refreshToken: IRefreshTokenDTO;
    }>
  > {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      let tokens: {
        jwtToken: IJwtTokenDTO;
        refreshToken: IRefreshTokenDTO;
      };

      if (refreshToken) {
        tokens = Object.freeze(
          await this.generateByToken({
            trx,
            refreshToken,
          }),
        );
      } else {
        tokens = Object.freeze(
          await this.generateByEmail({
            trx,
            email,
            password,
          }),
        );
      }

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
