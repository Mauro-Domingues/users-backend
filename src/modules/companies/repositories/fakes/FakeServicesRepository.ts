import { Service } from '@modules/companies/entities/Service';
import type { IServicesRepository } from '@modules/companies/repositories/IServicesRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeServicesRepository
  extends FakeBaseRepository<Service>
  implements IServicesRepository
{
  public constructor() {
    super(Service);
  }

  // non-generic methods here
}
