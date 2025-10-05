import { User } from '@modules/users/entities/User';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { Joi } from 'celebrate';
import { profileSchema } from '../profiles/profileSchema';
import { addressSchema } from '../addresses/addressSchema';

export const userSchema: Record<keyof User, Joi.Schema> = {
  ...baseSchema,
  email: Joi.string().email().max(255),
  password: Joi.string().max(255),
  address: Joi.object(addressSchema),
  addressId: addressSchema.id,
  profile: Joi.object(profileSchema),
  profileId: profileSchema.id,
};
