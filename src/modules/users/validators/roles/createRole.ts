import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { roleSchema } from './roleSchema';

export const createRole = baseValidator(ctx => {
  const roleValidationSchema = roleSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: roleValidationSchema.keys({
      name: roleValidationSchema.extract('name').required(),
    }),
  };
});
