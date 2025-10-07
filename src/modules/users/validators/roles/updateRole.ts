import { celebrate, Segments, Joi } from 'celebrate';
import { Role } from '@modules/users/entities/Role';
import { IRoleDTO } from '@modules/users/dtos/IRoleDTO';
import { roleSchema } from './roleSchema';

export const updateRole = celebrate({
  [Segments.PARAMS]: Joi.object<Role>({ id: roleSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IRoleDTO>(roleSchema),
});
