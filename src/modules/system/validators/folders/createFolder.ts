import { celebrate, Segments, Joi } from 'celebrate';
import { IFolderDTO } from '@modules/system/dtos/IFolderDTO';
import { folderSchema } from './folderSchema';

export const createFolder = celebrate({
  [Segments.PARAMS]: Joi.object({}),
  [Segments.QUERY]: Joi.object({}),
  [Segments.BODY]: Joi.object<IFolderDTO>({
    ...folderSchema,
    name: folderSchema.name.required(),
    slug: folderSchema.slug.forbidden(),
  }),
});
