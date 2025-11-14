import { User } from '@modules/users/entities/User';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { addressSchema } from '../addresses/addressSchema';
import { permissionSchema } from '../permissions/permissionSchema';
import { profileSchema } from '../profiles/profileSchema';
import { roleSchema } from '../roles/roleSchema';

export const userSchema = baseSchema(User, (ctx, { id }) => {
  const permissionValidationSchema = permissionSchema(ctx);
  const addressValidationSchema = addressSchema(ctx);
  const profileValidationSchema = profileSchema(ctx);
  const roleValidationSchema = roleSchema(ctx);

  return {
    permissions: ctx.array().items(permissionValidationSchema),
    email: ctx.string().email().max(255),
    password: ctx.string().max(255),
    address: addressValidationSchema,
    addressId: id,
    profile: profileValidationSchema,
    profileId: id,
    role: roleValidationSchema,
    roleId: id,
  };
});
