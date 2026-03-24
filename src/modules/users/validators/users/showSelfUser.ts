import { baseValidator } from '@shared/container/modules/validators/baseValidator';

export const showSelfUser = baseValidator(ctx => {
  return {
    params: ctx.object({}),
    query: ctx.object({}),
    body: ctx.object({}),
  };
});
