import { instanceToInstance } from 'class-transformer';
import { Body, Inject, Path, Put, Route, Tags } from 'tsoa';
import { inject, injectable } from 'tsyringe';
import type { QueryRunner } from 'typeorm';
import type { IResponseDTO } from '@dtos/IResponseDTO';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import type { IUserDTO } from '@modules/users/dtos/IUserDTO';
import type { Address } from '@modules/users/entities/Address';
import type { Profile } from '@modules/users/entities/Profile';
import type { User } from '@modules/users/entities/User';
import type { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import type { IProfilesRepository } from '@modules/users/repositories/IProfilesRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import type { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import type { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';
import type { IConnection } from '@shared/typeorm';
import { updateAttribute } from '@utils/mappers';
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
    @Inject() connection: IConnection,
    @Path() id: string,
    @Body() userData: IUserDTO,
  ): Promise<IResponseDTO<User>> {
    const trx = connection.mysql.createQueryRunner();

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

      await this.cacheProvider.invalidatePrefix(`${connection.client}:users`);
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
