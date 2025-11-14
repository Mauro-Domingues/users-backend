import { File } from '@modules/system/entities/File';
import { baseSchema } from '@shared/container/modules/validators/baseSchema';

export const fileSchema = baseSchema(File, (ctx, { id }) => ({
  name: ctx.string().max(255),
  file: ctx.string().max(255),
  fileUrl: ctx.string().uri(),
  folderId: id,
}));
