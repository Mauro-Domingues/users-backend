import { IOAuth2CallbackDTO } from '@modules/users/dtos/IOAuth2CallbackDTO';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';

export const oauth2Callback = baseValidator(ctx => ({
  query: ctx.object<IOAuth2CallbackDTO>({
    error: ctx
      .string()
      .valid(
        'access_denied',
        'server_error',
        'temporarily_unavailable',
        'invalid_request',
        'unauthorized_client',
        'unsupported_response_type',
      )
      .optional(),
    code: ctx.string(),
    state: ctx.string().uri().required(),
    scope: ctx.string().optional(),
    authuser: ctx.number().valid(0, 1).optional(),
    prompt: ctx
      .string()
      .pattern(
        /^(none|consent|select_account)( (none|consent|select_account))*$/,
      )
      .optional(),
    hd: ctx.string().domain().optional(),
  }),
  params: ctx.object({}),
  body: ctx.object({}),
}));
