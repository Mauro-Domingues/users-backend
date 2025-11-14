import { IRoleTypeDTO } from '@modules/users/dtos/IRoleTypeDTO';
import { Role } from '@modules/users/entities/Role';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { permissionSchema } from '../permissions/permissionSchema';

export const roleSchema = baseSchema(Role, (ctx, { id }) => {
  const permissionValidationSchema = permissionSchema(ctx);

  return {
    name: ctx.string().max(255),
    description: ctx.string().max(255),
    type: ctx.string().valid(...Object.values(IRoleTypeDTO)),
    permissions: ctx.array().items(permissionValidationSchema),
    users: ctx.array().items(ctx.object({ id })),
  };
});
