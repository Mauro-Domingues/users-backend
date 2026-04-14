import { Service } from '@modules/companies/entities/Service';
import { ServiceStatus } from '@modules/companies/enums/ServiceStatus';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';

export const serviceSchema = baseSchema(Service, (ctx, { id }) => ({
  name: ctx.string().max(255),
  description: ctx.string().max(600),
  durationInMinutes: ctx.number().integer().positive(),
  companyId: id,
  price: ctx.number().positive().precision(2),
  status: ctx.string().valid(...Object.values(ServiceStatus)),
}));
