import { Role } from '@modules/users/entities/Role';
import { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class RolesRepository
  extends BaseRepository<Role>
  implements IRolesRepository
{
  public constructor() {
    super(Role);
  }

  // non-generic methods here
}
