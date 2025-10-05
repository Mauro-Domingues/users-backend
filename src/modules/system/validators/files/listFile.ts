import { celebrate, Segments, Joi } from 'celebrate';
import { File } from '@modules/system/entities/File';
import { fileSchema } from './fileSchema';

export const listFile = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object<File & { page: number; limit: number }>({
    ...fileSchema,
    page: Joi.number().integer().optional(),
    limit: Joi.number().integer().optional(),
  }),
  [Segments.BODY]: Joi.object({}),
}) as ReturnType<typeof celebrate>;
