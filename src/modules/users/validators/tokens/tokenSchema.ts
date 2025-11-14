import { Joi } from 'celebrate';
import { Token } from '@modules/users/entities/Token';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { userSchema } from '../users/userSchema';

export const tokenSchema = baseSchema(Token, (ctx, { id }) => {
  const userValidationSchema = userSchema(ctx);

  return {
    userId: id,
    token: Joi.string().max(255),
    user: userValidationSchema,
  };
});
