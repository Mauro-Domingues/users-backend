import { celebrate, Segments, Joi } from 'celebrate';
import { User } from '@modules/users/entities/User';
import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { userSchema } from './userSchema';

export const updateUser = celebrate({
  [Segments.PARAMS]: Joi.object<User>({ id: userSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IUserDTO>({
    ...userSchema,
    password: userSchema.password.forbidden(),
  }),
});
