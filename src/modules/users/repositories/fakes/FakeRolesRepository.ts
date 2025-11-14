import { Role } from '@modules/users/entities/Role';
import type { IRolesRepository } from '@modules/users/repositories/IRolesRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeRolesRepository
  extends FakeBaseRepository<Role>
  implements IRolesRepository
{
  public constructor() {
    super(Role);
  }

  // non-generic methods here
}
