import { Token } from '@modules/users/entities/Token';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeTokensRepository
  extends FakeBaseRepository<Token>
  implements ITokensRepository
{
  public constructor() {
    super(Token);
  }

  // non-generic methods here
}
