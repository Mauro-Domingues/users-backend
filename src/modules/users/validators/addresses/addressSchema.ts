import { Address } from '@modules/users/entities/Address';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';

export const addressSchema = baseSchema(Address, ctx => ({
  city: ctx.string().max(255),
  street: ctx.string().max(255),
  complement: ctx.string().max(255),
  district: ctx.string().max(255),
  zipcode: ctx.string().max(8),
  uf: ctx.string().uppercase().max(2),
  number: ctx.number().integer().positive(),
  lat: ctx.number().min(-90).max(90).precision(6),
  lon: ctx.number().min(-180).max(180).precision(6),
}));
