import type { Permission } from '@modules/users/entities/Permission';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IPermissionsRepository extends IBaseRepository<Permission> {
  // non-generic methods here
}
