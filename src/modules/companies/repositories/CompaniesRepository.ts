import { Company } from '@modules/companies/entities/Company';
import type { ICompaniesRepository } from '@modules/companies/repositories/ICompaniesRepository';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';

export class CompaniesRepository
  extends BaseRepository<Company>
  implements ICompaniesRepository
{
  public constructor() {
    super(Company);
  }

  // non-generic methods here
}
