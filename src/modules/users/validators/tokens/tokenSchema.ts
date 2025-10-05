import { Token } from '@modules/users/entities/Token';
import { Joi } from 'celebrate';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { userSchema } from '../users/userSchema';

export const tokenSchema: Record<keyof Token, Joi.Schema> = {
  ...baseSchema,
  userId: userSchema.id,
  token: Joi.string().max(255),
  user: Joi.object(userSchema),
};
