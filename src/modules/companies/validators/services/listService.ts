import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { serviceSchema } from './serviceSchema';

export const listService = baseValidator(ctx => {
  const serviceValidationSchema = serviceSchema(ctx);

  return {
    params: ctx.object({}),
    query: serviceValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
