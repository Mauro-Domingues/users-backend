import { IOAuth2RequestDTO } from '@modules/users/dtos/IOAuth2RequestDTO';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';

export const oauth2Request = baseValidator(ctx => ({
  query: ctx.object<IOAuth2RequestDTO>({
    redirectUrl: ctx.string().uri().required(),
  }),
  params: ctx.object({}),
  body: ctx.object({}),
}));
