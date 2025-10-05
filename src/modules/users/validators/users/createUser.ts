import { celebrate, Segments, Joi } from 'celebrate';
import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { userSchema } from './userSchema';

export const createUser = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IUserDTO>({
    ...userSchema,
    email: userSchema.email.required(),
    password: userSchema.password.required(),
  }),
});
