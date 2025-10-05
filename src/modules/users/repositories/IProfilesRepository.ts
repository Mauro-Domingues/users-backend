import { Profile } from '@modules/users/entities/Profile';
import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IProfilesRepository extends IBaseRepository<Profile> {
  // non-generic methods here
}
