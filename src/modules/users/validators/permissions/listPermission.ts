import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { permissionSchema } from './permissionSchema';

export const listPermission = baseValidator(ctx => {
  const permissionValidationSchema = permissionSchema(ctx);

  return {
    params: ctx.object({}),
    query: permissionValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
