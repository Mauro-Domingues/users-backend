import { celebrate, Segments, Joi } from 'celebrate';
import { Permission } from '@modules/users/entities/Permission';
import { permissionSchema } from './permissionSchema';

export const listPermission = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object<Permission & { page: number; limit: number }>({
    ...permissionSchema,
    page: Joi.number().integer().positive().optional(),
    limit: Joi.number().integer().positive().optional(),
  }),
  [Segments.BODY]: Joi.object({}),
});
