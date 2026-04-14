import { Company } from '@modules/companies/entities/Company';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';

export class FakeCompaniesRepository
  extends FakeBaseRepository<Company>
  implements ICompaniesRepository
{
  public constructor() {
    super(Company);
  }

  // non-generic methods here
}
