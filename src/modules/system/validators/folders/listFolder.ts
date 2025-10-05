import { celebrate, Segments, Joi } from 'celebrate';
import { Folder } from '@modules/system/entities/Folder';
import { folderSchema } from './folderSchema';

export const listFolder = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object<Folder & { page: number; limit: number }>({
    ...folderSchema,
    page: Joi.number().integer().optional(),
    limit: Joi.number().integer().optional(),
  }),
  [Segments.BODY]: Joi.object({}),
});
