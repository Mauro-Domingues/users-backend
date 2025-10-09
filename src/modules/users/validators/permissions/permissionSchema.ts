import { Permission } from '@modules/users/entities/Permission';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { Joi } from 'celebrate';

export const permissionSchema: Record<keyof Permission, Joi.Schema> = {
  ...baseSchema,
  name: Joi.string().max(255),
  description: Joi.string().max(255),
};
