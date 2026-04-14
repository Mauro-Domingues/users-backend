import type { Company } from '@modules/companies/entities/Company';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface ICompaniesRepository extends IBaseRepository<Company> {
  // non-generic methods here
}
