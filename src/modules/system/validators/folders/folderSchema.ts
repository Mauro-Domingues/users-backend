import { Folder } from '@modules/system/entities/Folder';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';
import { fileSchema } from '../files/fileSchema';

export const folderSchema = baseSchema(Folder, ctx => ({
  name: ctx.string().max(255),
  slug: ctx
    .string()
    .pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(255),
  files: ctx.array().items(fileSchema(ctx)),
}));
