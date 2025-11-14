import type { IAuthDTO } from '@modules/users/dtos/IAuthDTO';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { tokenSchema } from '../tokens/tokenSchema';
import { userSchema } from './userSchema';

export const authenticateUser = baseValidator(ctx => {
  const userValidationSchema = userSchema(ctx);
  const tokenValidationSchema = tokenSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: ctx.object<IAuthDTO>({
      email: userValidationSchema.extract('email').when('refreshToken', {
        is: ctx.exist(),
        then: ctx.optional(),
        otherwise: ctx.required(),
      }),
      password: userValidationSchema.extract('password').when('refreshToken', {
        is: ctx.exist(),
        then: ctx.optional(),
        otherwise: ctx.required(),
      }),
      refreshToken: tokenValidationSchema.extract('token').optional(),
    }),
  };
});
