import { Profile } from '@modules/users/entities/Profile';
import type { IProfilesRepository } from '@modules/users/repositories/IProfilesRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class ProfilesRepository
  extends BaseRepository<Profile>
  implements IProfilesRepository
{
  public constructor() {
    super(Profile);
  }

  // non-generic methods here
}
