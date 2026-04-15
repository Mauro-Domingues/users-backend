import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { serviceSchema } from './serviceSchema';

export const selectService = baseValidator(ctx => {
  const serviceValidationSchema = serviceSchema(ctx);

  return {
    params: ctx.object({}),
    query: serviceValidationSchema,
    body: ctx.object({}),
  };
});
