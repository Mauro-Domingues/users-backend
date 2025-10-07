import { celebrate, Segments, Joi } from 'celebrate';
import { Role } from '@modules/users/entities/Role';
import { roleSchema } from './roleSchema';

export const listRole = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object<Role & { page: number; limit: number }>({
    ...roleSchema,
    page: Joi.number().integer().positive().optional(),
    limit: Joi.number().integer().positive().optional(),
  }),
  [Segments.BODY]: Joi.object({}),
});
