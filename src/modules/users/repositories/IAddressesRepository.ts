import type { Address } from '@modules/users/entities/Address';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IAddressesRepository extends IBaseRepository<Address> {
  // non-generic methods here
}
