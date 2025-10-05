import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';
import { PasswordReset } from '../entities/PasswordReset';

export interface IPasswordResetsRepository
  extends IBaseRepository<PasswordReset> {
  // non-generic methods here
}
