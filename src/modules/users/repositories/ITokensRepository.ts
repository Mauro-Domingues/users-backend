import { Token } from '@modules/users/entities/Token';
import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface ITokensRepository extends IBaseRepository<Token> {
  // non-generic methods here
}
