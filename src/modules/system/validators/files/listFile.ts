import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { fileSchema } from './fileSchema';

export const listFile = baseValidator(ctx => {
  const fileValidationSchema = fileSchema(ctx);

  return {
    params: ctx.object({}),
    query: fileValidationSchema.concat(
      ctx.object({
        page: ctx.number().integer().positive().optional(),
        limit: ctx.number().integer().positive().optional(),
      }),
    ),
    body: ctx.object({}),
  };
});
