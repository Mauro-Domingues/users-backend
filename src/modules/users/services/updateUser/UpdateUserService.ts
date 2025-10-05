import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { updateAttribute } from '@utils/mappers';
import { User } from '@modules/users/entities/User';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { Route, Tags, Put, Body, Path } from 'tsoa';
import { Profile } from '@modules/users/entities/Profile';
import { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import { IProfilesRepository } from '@modules/users/repositories/IProfilesRepository';
import { QueryRunner } from 'typeorm';
import { Address } from '@modules/users/entities/Address';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { SimpleDependency } from '@utils/simpleDependency';

@Route('/users')
@injectable()
export class UpdateUserService extends SimpleDependency {
  public constructor(
    @inject('UsersRepository')
    private readonly usersRepository: IUsersRepository,

    @inject('ProfilesRepository')
    private readonly profilesRepository: IProfilesRepository,

    @inject('AddressesRepository')
    private readonly addressesRepository: IAddressesRepository,

    @inject('FilesRepository')
    protected readonly filesRepository: IFilesRepository,

    @inject('StorageProvider')
    protected readonly storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {
    super();
  }

  private async patchAddress({
    address,
    trx,
    user,
  }: {
    trx: QueryRunner;
    user: User;
    address: Address;
  }): Promise<void> {
    await this.createOrUpdateEntity({
      repository: this.addressesRepository,
      reference: 'address',
      entity: address,
      target: user,
      trx,
    });
  }

  private async patchProfile({
    profile,
    trx,
    user,
  }: {
    trx: QueryRunner;
    user: User;
    profile: Profile;
  }): Promise<void> {
    const existingProfile = await this.createOrUpdateEntity({
      repository: this.profilesRepository,
      entity: profile,
      reference: 'profile',
      target: user,
      trx,
    });

    if (existingProfile && profile.avatarId) {
      await this.patchFile({
        target: existingProfile,
        field: 'avatarId',
        data: profile,
        trx,
      });
    }
  }

  @Put('{id}')
  @Tags('User')
  public async execute(
    @Path() id: string,
    @Body() userData: IUserDTO,
  ): Promise<IResponseDTO<User>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const { address, profile, ...rest } = userData;

      const user = await this.usersRepository.findBy(
        {
          where: { id },
          select: { id: true, addressId: true, profileId: true },
        },
        trx,
      );

      if (!user) {
        throw new AppError('NOT_FOUND', 'User not found', 404);
      }

      if (address) await this.patchAddress({ address, trx, user });
      if (profile) await this.patchProfile({ profile, trx, user });

      await this.usersRepository.update(updateAttribute(user, rest), trx);

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:users`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        messageCode: 'UPDATED',
        message: 'Successfully updated user',
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
