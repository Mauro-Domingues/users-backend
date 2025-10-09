import { Permission } from '@modules/users/entities/Permission';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakePermissionsRepository
  extends FakeBaseRepository<Permission>
  implements IPermissionsRepository
{
  public constructor() {
    super(Permission);
  }

  // non-generic methods here
}
