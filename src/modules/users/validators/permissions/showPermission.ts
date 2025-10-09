import { celebrate, Segments, Joi } from 'celebrate';
import { Permission } from '@modules/users/entities/Permission';
import { permissionSchema } from './permissionSchema';

export const showPermission = celebrate({
  [Segments.PARAMS]: Joi.object<Permission>({ id: permissionSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});
