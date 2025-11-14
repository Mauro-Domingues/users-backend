import type { Role } from '@modules/users/entities/Role';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { roleSchema } from './roleSchema';

export const updateRole = baseValidator(ctx => {
  const roleValidationSchema = roleSchema(ctx);

  return {
    params: ctx.object<Role>({
      id: roleValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: roleValidationSchema,
  };
});
