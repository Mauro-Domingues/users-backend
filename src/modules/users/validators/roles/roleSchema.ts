import { Role } from '@modules/users/entities/Role';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { Joi } from 'celebrate';

export const roleSchema: Record<keyof Role, Joi.Schema> = {
  ...baseSchema,
  name: Joi.string().max(255),
  description: Joi.string().max(255),
};
