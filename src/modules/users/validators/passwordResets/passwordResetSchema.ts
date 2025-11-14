import { PasswordReset } from '@modules/users/entities/PasswordReset';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { userSchema } from '../users/userSchema';

export const passwordResetSchema = baseSchema(PasswordReset, (ctx, { id }) => {
  const userValidationSchema = userSchema(ctx);

  return {
    userId: id,
    email: userValidationSchema.extract('email'),
    recoveryCode: ctx.number().integer().min(100000).max(999999),
    user: userValidationSchema,
  };
});
