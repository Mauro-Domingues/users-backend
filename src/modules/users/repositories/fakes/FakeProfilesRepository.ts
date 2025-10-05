import { Profile } from '@modules/users/entities/Profile';
import { IProfilesRepository } from '@modules/users/repositories/IProfilesRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeProfilesRepository
  extends FakeBaseRepository<Profile>
  implements IProfilesRepository
{
  public constructor() {
    super(Profile);
  }

  // non-generic methods here
}
