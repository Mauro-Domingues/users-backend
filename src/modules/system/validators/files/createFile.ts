import { celebrate, Segments, Joi } from 'celebrate';
import { ICreateFileDTO } from '@modules/system/dtos/ICreateFileDTO';
import { folderSchema } from '../folders/folderSchema';

export const createFile = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<ICreateFileDTO>({
    folderId: folderSchema.id.optional(),
  }),
});
