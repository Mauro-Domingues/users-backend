import { ICheckTokenDTO } from '@modules/users/dtos/ICheckTokenDTO';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { passwordResetSchema } from '../passwordResets/passwordResetSchema';
import { userSchema } from '../users/userSchema';

export const checkToken = baseValidator(ctx => {
  const userValidationSchema = userSchema(ctx);
  const passwordResetValidationSchema = passwordResetSchema(ctx);

  return {
    query: ctx.object({}),
    params: ctx.object({}),
    body: ctx.object<ICheckTokenDTO>({
      email: userValidationSchema.extract('email').required(),
      recoveryCode: passwordResetValidationSchema
        .extract('recoveryCode')
        .required(),
    }),
  };
});
