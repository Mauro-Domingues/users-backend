import { IOAuth2CallbackDTO } from '@modules/users/dtos/IOAuth2CallbackDTO';
import { celebrate, Segments, Joi } from 'celebrate';

export const oauth2Callback = celebrate({
  [Segments.QUERY]: Joi.object<IOAuth2CallbackDTO>({
    error: Joi.string()
      .valid(
        'access_denied',
        'server_error',
        'temporarily_unavailable',
        'invalid_request',
        'unauthorized_client',
        'unsupported_response_type',
      )
      .optional(),
    code: Joi.string(),
    state: Joi.string().uri().required(),
    scope: Joi.string().optional(),
    authuser: Joi.number().valid(0, 1).optional(),
    prompt: Joi.string()
      .pattern(
        /^(none|consent|select_account)( (none|consent|select_account))*$/,
      )
      .optional(),
    hd: Joi.string().domain().optional(),
  }),
  [Segments.PARAMS]: Joi.object({}),
  [Segments.BODY]: Joi.object({}),
});
