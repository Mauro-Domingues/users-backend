import { Service } from '@modules/companies/entities/Service';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class ServicesRepository
  extends BaseRepository<Service>
  implements IServicesRepository
{
  public constructor() {
    super(Service);
  }

  // non-generic methods here
}
