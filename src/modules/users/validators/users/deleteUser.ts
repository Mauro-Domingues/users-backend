import { celebrate, Segments, Joi } from 'celebrate';
import { User } from '@modules/users/entities/User';
import { userSchema } from './userSchema';

export const deleteUser = celebrate({
  [Segments.PARAMS]: Joi.object<User>({ id: userSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});
