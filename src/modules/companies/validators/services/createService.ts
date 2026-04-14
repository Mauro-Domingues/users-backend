import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { serviceSchema } from './serviceSchema';

export const createService = baseValidator(ctx => {
  const serviceValidationSchema = serviceSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: serviceValidationSchema.keys({
      name: serviceValidationSchema.extract('name').required(),
      price: serviceValidationSchema.extract('price').required(),
      companyId: serviceValidationSchema.extract('companyId').required(),
      durationInMinutes: serviceValidationSchema
        .extract('durationInMinutes')
        .required(),
    }),
  };
});
