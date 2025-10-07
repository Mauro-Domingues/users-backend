import { Role } from '@modules/users/entities/Role';
import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IRolesRepository extends IBaseRepository<Role> {
  // non-generic methods here
}
