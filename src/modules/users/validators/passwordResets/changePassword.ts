import { celebrate, Segments, Joi } from 'celebrate';
import { IChangePasswordDTO } from '@modules/users/dtos/IChangePasswordDTO';
import { userSchema } from '../users/userSchema';

export const changePassword = celebrate({
  [Segments.QUERY]: Joi.object({}),
  [Segments.PARAMS]: Joi.object({}),
  [Segments.BODY]: Joi.object<IChangePasswordDTO>({
    password: userSchema.password.required(),
  }),
});
