import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { roleSchema } from './roleSchema';

export const listRole = baseValidator(ctx => {
  const roleValidationSchema = roleSchema(ctx);

  return {
    params: ctx.object({}),
    query: roleValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
