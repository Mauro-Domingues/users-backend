import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { userSchema } from './userSchema';

export const createUser = baseValidator(ctx => {
  const userValidationSchema = userSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: userValidationSchema.keys({
      email: userValidationSchema.extract('email').required(),
      password: userValidationSchema.extract('password').required(),
      role: userValidationSchema.extract('role').forbidden(),
    }),
  };
});
