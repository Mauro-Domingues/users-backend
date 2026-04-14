import type { Service } from '@modules/companies/entities/Service';
import type { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IServicesRepository extends IBaseRepository<Service> {
  // non-generic methods here
}
