import type { User } from '@modules/users/entities/User';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { userSchema } from './userSchema';

export const showUser = baseValidator(ctx => {
  const userValidationSchema = userSchema(ctx);

  return {
    params: ctx.object<User>({
      id: userValidationSchema.extract('id').required(),
    }),
    query: ctx.object({}),
    body: ctx.object({}),
  };
});
