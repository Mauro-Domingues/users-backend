import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { folderSchema } from './folderSchema';

export const selectFolder = baseValidator(ctx => {
  const folderValidationSchema = folderSchema(ctx);

  return {
    params: ctx.object({}),
    query: folderValidationSchema,
    body: ctx.object({}),
  };
});
