import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import type { IRefreshTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IRefreshTokenDTO';
import type { ICryptoProvider } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import type { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

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
    @Inject() connection: IConnection,
    @Body() { email, password, refreshToken }: IAuthDTO,
  ): Promise<
    IResponseDTO<{
      jwtToken: IJwtTokenDTO;
      refreshToken: IRefreshTokenDTO;
    }>
  > {
    const trx = connection.mysql.createQueryRunner();

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
