import type { File } from '@modules/system/entities/File';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { fileSchema } from './fileSchema';

export const showFile = baseValidator(ctx => {
  const fileValidationSchema = fileSchema(ctx);

  return {
    params: ctx.object<File>({
      id: fileValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: ctx.object({}),
  };
});
