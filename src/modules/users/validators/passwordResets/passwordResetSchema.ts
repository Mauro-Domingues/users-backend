import { Joi } from 'celebrate';
import { PasswordReset } from '@modules/users/entities/PasswordReset';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { userSchema } from '../users/userSchema';

export const passwordResetSchema: Record<keyof PasswordReset, Joi.Schema> = {
  ...baseSchema,
  userId: userSchema.id,
  email: userSchema.email,
  recoveryCode: Joi.number().integer().min(100000).max(999999),
  user: Joi.object(userSchema),
};
