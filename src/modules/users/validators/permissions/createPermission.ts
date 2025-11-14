import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { permissionSchema } from './permissionSchema';

export const createPermission = baseValidator(ctx => {
  const permissionValidationSchema = permissionSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: permissionValidationSchema.keys({
      name: permissionValidationSchema.extract('name').required(),
    }),
  };
});
