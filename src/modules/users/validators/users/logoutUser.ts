import type { ILogoutDTO } from '@modules/users/dtos/ILogoutDTO';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';
import { tokenSchema } from '../tokens/tokenSchema';

export const loggoutUser = baseValidator(ctx => {
  const tokenValidationSchema = tokenSchema(ctx);

  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: ctx.object<ILogoutDTO>({
      deviceId: tokenValidationSchema.extract('deviceId').required(),
    }),
  };
});
