import './providers';
import { container } from 'tsyringe';
import { FilesRepository } from '@modules/system/repositories/FilesRepository';
import { FoldersRepository } from '@modules/system/repositories/FoldersRepository';
import { IFilesRepository } from '@modules/system/repositories/IFilesRepository';
import { IFoldersRepository } from '@modules/system/repositories/IFoldersRepository';
import { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import { IProfilesRepository } from '@modules/users/repositories/IProfilesRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { PasswordResetsRepository } from '@modules/users/repositories/PasswordResetsRepository';
import { ProfilesRepository } from '@modules/users/repositories/ProfilesRepository';
import { UsersRepository } from '@modules/users/repositories/UsersRepository';
import { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import { TokensRepository } from '@modules/users/repositories/TokensRepository';
import { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import { AddressesRepository } from '@modules/users/repositories/AdressesRepository';

import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { RolesRepository } from '@modules/users/repositories/RolesRepository';

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
