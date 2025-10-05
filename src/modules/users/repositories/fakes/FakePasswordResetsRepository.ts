import { PasswordReset } from '@modules/users/entities/PasswordReset';
import { IPasswordResetsRepository } from '@modules/users/repositories/IPasswordResetsRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakePasswordResetsRepository
  extends FakeBaseRepository<PasswordReset>
  implements IPasswordResetsRepository
{
  public constructor() {
    super(PasswordReset);
  }

  // non-generic methods here
}
