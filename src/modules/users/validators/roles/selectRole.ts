import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { roleSchema } from './roleSchema';

export const selectRole = baseValidator(ctx => {
  const roleValidationSchema = roleSchema(ctx);

  return {
    params: ctx.object({}),
    query: roleValidationSchema,
    body: ctx.object({}),
  };
});
