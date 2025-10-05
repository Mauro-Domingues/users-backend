import { Profile } from '@modules/users/entities/Profile';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { Joi } from 'celebrate';
import { fileSchema } from '@modules/system/validators/files/fileSchema';

export const profileSchema: Record<keyof Profile, Joi.Schema> = {
  ...baseSchema,
  fullName: Joi.string().max(255),
  birthday: Joi.date().iso(),
  avatar: Joi.object(fileSchema),
  avatarId: fileSchema.id,
  phone: Joi.string().pattern(/^\d+$/).max(11),
  cpf: Joi.string().pattern(/^\d+$/).max(11),
};
