import type { Token } from '@modules/users/entities/Token';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface ITokensRepository extends IBaseRepository<Token> {
  // non-generic methods here
}
