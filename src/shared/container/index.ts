import './providers';
import { container } from 'tsyringe';
import { FilesRepository } from '@modules/system/repositories/FilesRepository';
import { FoldersRepository } from '@modules/system/repositories/FoldersRepository';
import type { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import type { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { AddressesRepository } from '@modules/users/repositories/AdressesRepository';
import type { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import type { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import type { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import type { IProfilesRepository } from '@modules/users/repositories/IProfilesRepository';
import type { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import type { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { PasswordResetsRepository } from '@modules/users/repositories/PasswordResetsRepository';
import { PermissionsRepository } from '@modules/users/repositories/PermissionsRepository';
import { ProfilesRepository } from '@modules/users/repositories/ProfilesRepository';
import { RolesRepository } from '@modules/users/repositories/RolesRepository';
import { TokensRepository } from '@modules/users/repositories/TokensRepository';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';

container.registerSingleton<ITokensRepository>(
  'TokensRepository',
  TokensRepository,
);

container.registerSingleton<IAddressesRepository>(
  'AddressesRepository',
  AddressesRepository,
);

container.registerSingleton<IFoldersRepository>(
  'FoldersRepository',
  FoldersRepository,
);

container.registerSingleton<IFilesRepository>(
  'FilesRepository',
  FilesRepository,
);

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IPasswordResetsRepository>(
  'PasswordResetsRepository',
  PasswordResetsRepository,
);

container.registerSingleton<IProfilesRepository>(
  'ProfilesRepository',
  ProfilesRepository,
);

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);

container.registerSingleton<IPermissionsRepository>(
  'PermissionsRepository',
  PermissionsRepository,
);
