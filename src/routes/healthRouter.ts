import type { Request, Response } from 'express';
import { Router } from 'express';
import { baseValidator } from '@shared/container/modules/validators/baseValidator';

const healthRouter = Router();

healthRouter.get(
  '/health',
  baseValidator(ctx => ({
    params: ctx.object({}),
    query: ctx.object({}),
    body: ctx.object({}),
  })),
  (_request: Request, response: Response): void => {
    response.sendStatus(204);
  },
);

export { healthRouter };
