import { celebrate, Segments, Joi } from 'celebrate';
import { File } from '@modules/system/entities/File';
import { IFileDTO } from '@modules/system/dtos/IFileDTO';
import { fileSchema } from './fileSchema';

export const updateFile = celebrate({
  [Segments.PARAMS]: Joi.object<File>({ id: fileSchema.id.required() }),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IFileDTO>(fileSchema),
});
