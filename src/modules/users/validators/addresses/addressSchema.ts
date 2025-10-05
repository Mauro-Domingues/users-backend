import { Address } from '@modules/users/entities/Address';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { Joi } from 'celebrate';

export const addressSchema: Record<keyof Address, Joi.Schema> = {
  ...baseSchema,
  city: Joi.string().max(255),
  street: Joi.string().max(255),
  complement: Joi.string().max(255),
  district: Joi.string().max(255),
  zipcode: Joi.string().max(8),
  uf: Joi.string().uppercase().max(2),
  number: Joi.number().integer().positive(),
  lat: Joi.number().min(-90).max(90).precision(6),
  lon: Joi.number().min(-180).max(180).precision(6),
  normalizeCoordinates: Joi.function().forbidden(),
};
