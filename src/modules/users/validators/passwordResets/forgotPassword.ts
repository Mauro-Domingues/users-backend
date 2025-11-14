import { IForgotPasswordDTO } from '@modules/users/dtos/IForgotPasswordDTO';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { userSchema } from '../users/userSchema';

export const forgotPassword = baseValidator(ctx => {
  const userValidationSchema = userSchema(ctx);

  return {
    query: ctx.object({}),
    params: ctx.object({}),
    body: ctx.object<IForgotPasswordDTO>({
      email: userValidationSchema.extract('email').required(),
    }),
  };
});
