import './providers';
import { container } from 'tsyringe';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { RolesRepository } from '@modules/users/repositories/RolesRepository';

container.registerSingleton<IRolesRepository>(
  'RolesRepository',
  RolesRepository,
);
