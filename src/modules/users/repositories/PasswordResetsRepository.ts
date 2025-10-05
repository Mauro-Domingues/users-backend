import { PasswordReset } from '@modules/users/entities/PasswordReset';
import { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class PasswordResetsRepository
  extends BaseRepository<PasswordReset>
  implements IPasswordResetsRepository
{
  public constructor() {
    super(PasswordReset);
  }

  // non-generic methods here
}
