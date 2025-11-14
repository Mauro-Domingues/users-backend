import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { folderSchema } from './folderSchema';

export const createFolder = baseValidator(ctx => {
  const folderValidationSchema = folderSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: folderValidationSchema.keys({
      name: folderValidationSchema.extract('name').required(),
      slug: folderValidationSchema.extract('slug').forbidden(),
    }),
  };
});
