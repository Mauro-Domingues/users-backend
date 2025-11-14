import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { fileSchema } from './fileSchema';

export const createFile = baseValidator(ctx => {
  const fileValidationSchema = fileSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: fileValidationSchema,
  };
});
