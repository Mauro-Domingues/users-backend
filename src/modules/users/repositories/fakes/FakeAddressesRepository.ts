import { Address } from '@modules/users/entities/Address';
import type { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeAddresssRepository
  extends FakeBaseRepository<Address>
  implements IAddressesRepository
{
  public constructor() {
    super(Address);
  }

  // non-generic methods here
}
