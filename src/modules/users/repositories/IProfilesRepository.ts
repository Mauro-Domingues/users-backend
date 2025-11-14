import type { Profile } from '@modules/users/entities/Profile';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IProfilesRepository extends IBaseRepository<Profile> {
  // non-generic methods here
}
