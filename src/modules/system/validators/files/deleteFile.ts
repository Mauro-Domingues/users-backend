import { celebrate, Segments, Joi } from 'celebrate';
import { File } from '@modules/system/entities/File';
import { fileSchema } from './fileSchema';

export const deleteFile = celebrate({
  [Segments.PARAMS]: Joi.object<File>({ id: fileSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});
