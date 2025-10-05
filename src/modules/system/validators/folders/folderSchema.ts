import { Folder } from '@modules/system/entities/Folder';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { Joi } from 'celebrate';
import { fileSchema } from '../files/fileSchema';

export const folderSchema: Record<keyof Folder, Joi.Schema> = {
  ...baseSchema,
  name: Joi.string().max(255),
  slug: Joi.string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(255),
  files: Joi.array().items(Joi.object(fileSchema)),
};
