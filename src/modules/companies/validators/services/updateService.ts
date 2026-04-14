import type { Service } from '@modules/companies/entities/Service';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { serviceSchema } from './serviceSchema';

export const updateService = baseValidator(ctx => {
  const serviceValidationSchema = serviceSchema(ctx);

  return {
    params: ctx.object<Service>({
      id: serviceValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: serviceValidationSchema,
  };
});
