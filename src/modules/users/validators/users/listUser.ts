import { celebrate, Segments, Joi } from 'celebrate';
import { User } from '@modules/users/entities/User';
import { userSchema } from './userSchema';

export const listUser = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object<User & { page: number; limit: number }>({
    ...userSchema,
    page: Joi.number().integer().optional(),
    limit: Joi.number().integer().optional(),
  }),
  [Segments.BODY]: Joi.object({}),
});
