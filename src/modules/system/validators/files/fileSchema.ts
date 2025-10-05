import { File } from '@modules/system/entities/File';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { Joi } from 'celebrate';
import { folderSchema } from '../folders/folderSchema';

export const fileSchema: Record<keyof File, Joi.Schema> = {
  ...baseSchema,
  name: Joi.string().max(255),
  file: Joi.string().max(255),
  fileUrl: Joi.string().uri(),
  folder: Joi.object(folderSchema),
  folderId: folderSchema.id,
  setFileUrl: Joi.function().forbidden(),
};
