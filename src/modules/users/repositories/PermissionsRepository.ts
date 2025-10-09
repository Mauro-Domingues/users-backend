import { Permission } from '@modules/users/entities/Permission';
import { IPermissionsRepository } from '@modules/users/repositories/IPermissionsRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class PermissionsRepository
  extends BaseRepository<Permission>
  implements IPermissionsRepository
{
  public constructor() {
    super(Permission);
  }

  // non-generic methods here
}
