import { celebrate, Segments, Joi } from 'celebrate';
import { ICheckTokenDTO } from '@modules/users/dtos/ICheckTokenDTO';
import { passwordResetSchema } from '../passwordResets/passwordResetSchema';
import { userSchema } from '../users/userSchema';

export const checkToken = celebrate({
  [Segments.QUERY]: Joi.object({}),
  [Segments.PARAMS]: Joi.object({}),
  [Segments.BODY]: Joi.object<ICheckTokenDTO>({
    email: userSchema.email.required(),
    recoveryCode: passwordResetSchema.recoveryCode.required(),
  }),
});
