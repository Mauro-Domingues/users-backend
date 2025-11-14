import { IChangePasswordDTO } from '@modules/users/dtos/IChangePasswordDTO';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { userSchema } from '../users/userSchema';

export const changePassword = baseValidator(ctx => {
  const userValidationSchema = userSchema(ctx);

  return {
    query: ctx.object({}),
    params: ctx.object({}),
    body: ctx.object<IChangePasswordDTO>({
      password: userValidationSchema.extract('password').required(),
    }),
  };
});
