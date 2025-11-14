import type { Permission } from '@modules/users/entities/Permission';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { permissionSchema } from './permissionSchema';

export const deletePermission = baseValidator(ctx => {
  const permissionValidationSchema = permissionSchema(ctx);

  return {
    params: ctx.object<Permission>({
      id: permissionValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: ctx.object({}),
  };
});
