import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { IJwtTokenDTO } from '@shared/container/providers/EncryptionProvider/dtos/IJwtTokenDTO';
import type { IRefreshTokenDTO } from '@shared/container/providers/EncryptionProvider/dtos/IRefreshTokenDTO';
import type { IEncryptionProvider } from '@shared/container/providers/EncryptionProvider/models/IEncryptionProvider';
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

    @inject('EncryptionProvider')
    private readonly encryptionProvider: IEncryptionProvider,
  ) {}

  private async generateByToken({
    refreshToken,
    deviceId,
    trx,
  }: {
    refreshToken: string;
    deviceId?: string;
    trx: QueryRunner;
  }): Promise<{
    jwtToken: IJwtTokenDTO;
    refreshToken: IRefreshTokenDTO;
  }> {
    const token = await this.tokensRepository.findBy(
      {
        where: {
          token: refreshToken,
          deviceId,
        },
        select: { id: true, userId: true },
      },
      trx,
    );

    if (!token) {
      throw new AppError('INVALID_TOKEN', 'Invalid token', 401);
    }

    const jwtToken = this.encryptionProvider.generateJwtToken(
      {},
      {
        subject: token.userId,
      },
    );

    const newRefreshToken = this.encryptionProvider.generateRefreshToken(
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
    deviceId,
    email,
    trx,
  }: {
    email: string;
    password: string;
    deviceId?: string;
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

    const jwtToken = this.encryptionProvider.generateJwtToken(
      {},
      {
        subject: checkUser.id,
      },
    );

    const refreshToken = this.encryptionProvider.generateRefreshToken(
      checkUser.id,
    );

    const checkToken = await this.tokensRepository.findBy(
      {
        where: {
          userId: checkUser.id,
          deviceId,
        },
        select: { id: true },
      },
      trx,
    );

    if (checkToken) {
      await this.tokensRepository.update(
        { ...checkToken, token: refreshToken.token },
        trx,
      );
    } else {
      await this.tokensRepository.create(
        {
          userId: checkUser.id,
          token: refreshToken.token,
          deviceId,
        },
        trx,
      );
    }

    return { jwtToken, refreshToken };
  }

  @Post()
  @Tags('User')
  public async execute(
    @Inject() connection: IConnection,
    @Body() { email, password, refreshToken, deviceId }: IAuthDTO,
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
            deviceId,
          }),
        );
      } else {
        tokens = Object.freeze(
          await this.generateByEmail({
            trx,
            email,
            password,
            deviceId,
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
