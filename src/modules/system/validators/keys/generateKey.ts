import { baseValidator } from '@shared/container/modules/validators/baseValidator';

export const generateKey = baseValidator(ctx => ({
  params: ctx.object({}),
  query: ctx.object({}),
  body: ctx.object({}),
}));
