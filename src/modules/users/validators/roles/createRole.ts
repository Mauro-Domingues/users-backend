import { celebrate, Segments, Joi } from 'celebrate';
import { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import { roleSchema } from './roleSchema';

export const createRole = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IRoleDTO>({
    ...roleSchema,
    name: roleSchema.name.required(),
  }),
});
