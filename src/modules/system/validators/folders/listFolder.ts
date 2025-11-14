import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { folderSchema } from './folderSchema';

export const listFolder = baseValidator(ctx => {
  const folderValidationSchema = folderSchema(ctx);

  return {
    params: ctx.object({}),
    query: folderValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
