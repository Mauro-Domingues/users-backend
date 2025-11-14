import { Token } from '@modules/users/entities/Token';
import type { ITokensRepository } from '@modules/users/repositories/ITokensRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class TokensRepository
  extends BaseRepository<Token>
  implements ITokensRepository
{
  public constructor() {
    super(Token);
  }

  // non-generic methods here
}
