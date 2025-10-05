import { celebrate, Segments, Joi } from 'celebrate';
import { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import { userSchema } from './userSchema';
import { tokenSchema } from '../tokens/tokenSchema';

export const authenticateUser = celebrate({
  [Segments.QUERY]: Joi.object({}),
  [Segments.PARAMS]: Joi.object({}),
  [Segments.BODY]: Joi.object<IAuthDTO>({
    email: userSchema.email.when('refreshToken', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    password: userSchema.password.when('refreshToken', {
      is: Joi.exist(),
      then: Joi.optional(),
      otherwise: Joi.required(),
    }),
    refreshToken: tokenSchema.token.optional(),
  }),
});
