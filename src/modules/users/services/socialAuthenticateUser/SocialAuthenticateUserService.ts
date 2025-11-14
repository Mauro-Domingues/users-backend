import { Get, Inject, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { ISocialAuthDTO } from '@modules/users/dtos/ISocialAuthDTO';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { IJwtTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IJwtTokenDTO';
import type { IRefreshTokenDTO } from '@shared/container/providers/CryptoProvider/dtos/IRefreshTokenDTO';
import type { ICryptoProvider } from '@shared/container/providers/CryptoProvider/models/ICryptoProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/auth/callback')
@injectable()
export class SocialAuthenticateUserService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('TokensRepository')
    private readonly tokensRepository: ITokensRepository,

    @inject('CryptoProvider')
    private readonly cryptoProvider: ICryptoProvider,
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
    @Inject() connection: IConnection,
    @Inject() { email, isAuthenticated }: ISocialAuthDTO,
  ): Promise<
    IResponseDTO<{
      jwtToken: IJwtTokenDTO;
      refreshToken: IRefreshTokenDTO;
    }>
  > {
    const trx = connection.mysql.createQueryRunner();

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
