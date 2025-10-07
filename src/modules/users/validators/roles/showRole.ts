import { celebrate, Segments, Joi } from 'celebrate';
import { Role } from '@modules/users/entities/Role';
import { roleSchema } from './roleSchema';

export const showRole = celebrate({
  [Segments.PARAMS]: Joi.object<Role>({ id: roleSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});
