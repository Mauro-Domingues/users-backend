import { Address } from '@modules/users/entities/Address';
import { IAddressesRepository } from '@modules/users/repositories/IAddressesRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class AddressesRepository
  extends BaseRepository<Address>
  implements IAddressesRepository
{
  public constructor() {
    super(Address);
  }

  // non-generic methods here
}
