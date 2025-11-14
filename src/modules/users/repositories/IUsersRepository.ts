import type { User } from '@modules/users/entities/User';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IUsersRepository extends IBaseRepository<User> {
  // non-generic methods here
}
