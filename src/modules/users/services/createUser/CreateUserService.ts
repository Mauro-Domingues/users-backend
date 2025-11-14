import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Post, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IUserDTO } from '@modules/users/dtos/IUserDTO';
import type { Address } from '@modules/users/entities/Address';
import type { Profile } from '@modules/users/entities/Profile';
import type { User } from '@modules/users/entities/User';
import type { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import type { IProfilesRepository } from '@modules/users/repositories/IProfilesRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';

@Route('/register')
@injectable()
export class CreateUserService {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('ProfilesRepository')
    private readonly profilesRepository: IProfilesRepository,

    @inject('AddressesRepository')
    private readonly addressesRepository: IAddressesRepository,

    @inject('HashProvider')
    private readonly hashProvider: IHashProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,
  ) {}

  private async setProfile({
    profile,
    trx,
    user,
  }: {
    trx: QueryRunner;
    user: User;
    profile: Profile;
  }): Promise<void> {
    user.profile = await this.profilesRepository.create(profile, trx);
  }

  private async setAddress({
    address,
    trx,
    user,
  }: {
    trx: QueryRunner;
    user: User;
    address: Address;
  }): Promise<void> {
    user.address = await this.addressesRepository.create(address, trx);
  }

  @Post()
  @Tags('User')
  public async execute(
    @Inject() connection: IConnection,
    @Body() userData: IUserDTO,
  ): Promise<IResponseDTO<User>> {
    const trx = connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const { profile, address, password, ...rest } = userData;

      const checkByEmail = await this.usersRepository.exists(
        {
          where: {
            email: rest.email,
          },
        },
        trx,
      );

      if (checkByEmail) {
        throw new AppError(
          'EMAIL_ALREADY_EXISTS',
          'Email address already in use',
        );
      }

      const hashedPassword = await this.hashProvider.generateHash(password);

      const user = await this.usersRepository.create(
        {
          ...rest,
          password: hashedPassword,
        },
        trx,
      );

      if (profile) await this.setProfile({ trx, user, profile });
      if (address) await this.setAddress({ trx, user, address });

      await this.usersRepository.update(user, trx);

      await this.cacheProvider.invalidatePrefix(`${connection.client}:users`);
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        messageCode: 'CREATED',
        message: 'User successfully created',
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
