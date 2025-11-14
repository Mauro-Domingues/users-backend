import type { Folder } from '@modules/system/entities/Folder';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { folderSchema } from './folderSchema';

export const deleteFolder = baseValidator(ctx => {
  const folderValidationSchema = folderSchema(ctx);

  return {
    params: ctx.object<Folder>({
      id: folderValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: ctx.object({}),
  };
});
