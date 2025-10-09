import { celebrate, Segments, Joi } from 'celebrate';
import { IPermissionDTO } from '@modules/users/dtos/IPermissionDTO';
import { permissionSchema } from './permissionSchema';

export const createPermission = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IPermissionDTO>({
    ...permissionSchema,
    name: permissionSchema.name.required(),
  }),
});
