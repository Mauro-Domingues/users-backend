import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { userSchema } from './userSchema';

export const selectUser = baseValidator(ctx => {
  const userValidationSchema = userSchema(ctx);

  return {
    params: ctx.object({}),
    query: userValidationSchema,
    body: ctx.object({}),
  };
});
