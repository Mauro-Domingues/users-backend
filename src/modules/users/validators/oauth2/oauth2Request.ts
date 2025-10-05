import { IOAuth2RequestDTO } from '@modules/users/dtos/IOAuth2RequestDTO';
import { celebrate, Segments, Joi } from 'celebrate';

export const oauth2Request = celebrate({
  [Segments.QUERY]: Joi.object<IOAuth2RequestDTO>({
    redirectUrl: Joi.string().uri().required(),
  }),
  [Segments.PARAMS]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});
