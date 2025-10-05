import { celebrate, Segments, Joi } from 'celebrate';
import { IForgotPasswordDTO } from '@modules/users/dtos/IForgotPasswordDTO';
import { userSchema } from '../users/userSchema';

export const forgotPassword = celebrate({
  [Segments.QUERY]: Joi.object({}),
  [Segments.PARAMS]: Joi.object({}),
  [Segments.BODY]: Joi.object<IForgotPasswordDTO>({
    email: userSchema.email.required(),
  }),
});
