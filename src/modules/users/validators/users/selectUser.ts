import { celebrate, Segments, Joi } from 'celebrate';
import { User } from '@modules/users/entities/User';
import { userSchema } from './userSchema';

export const selectUser = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object<User>(userSchema),
  [Segments.BODY]: Joi.object({}),
});
