import { IPermissionMethodDTO } from '@modules/users/dtos/IPermissionMethodDTO';
import { Permission } from '@modules/users/entities/Permission';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';

export const permissionSchema = baseSchema(Permission, (ctx, { id }) => ({
  name: ctx.string().max(255),
  description: ctx.string().max(255),
  method: ctx.string().valid(...Object.values(IPermissionMethodDTO)),
  route: ctx
    .string()
    .pattern(/^\/[\w-]+(\/[\w-]+)*$/)
    .max(245),
  slug: ctx
    .string()
    .pattern(
      new RegExp(
        `^[a-z0-9]+(?:-[a-z0-9]+)*___(${Object.values(IPermissionMethodDTO).join('|')})$`,
      ),
    )
    .max(255),
  users: ctx.array().items(ctx.object({ id })),
}));
