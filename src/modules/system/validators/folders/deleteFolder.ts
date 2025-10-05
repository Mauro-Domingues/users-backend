import { celebrate, Segments, Joi } from 'celebrate';
import { Folder } from '@modules/system/entities/Folder';
import { folderSchema } from './folderSchema';

export const deleteFolder = celebrate({
  [Segments.PARAMS]: Joi.object<Folder>({ id: folderSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});
