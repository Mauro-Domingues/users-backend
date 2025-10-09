import { celebrate, Segments, Joi } from 'celebrate';
import { Permission } from '@modules/users/entities/Permission';
import { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import { permissionSchema } from './permissionSchema';

export const updatePermission = celebrate({
  [Segments.PARAMS]: Joi.object<Permission>({ id: permissionSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IPermissionDTO>(permissionSchema),
});
