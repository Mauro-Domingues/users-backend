import { Router } from 'express';
import { guardRouter } from './guardRouter';
import { healthRouter } from './healthRouter';
import { sessionRouter } from './sessionRouter';
import { systemRouter } from './systemRouter';
import { userRouter } from './userRouter';

const routes = Router();

routes.use(guardRouter);
routes.use(healthRouter);
routes.use(sessionRouter);
routes.use(systemRouter);
routes.use(userRouter);

export { routes };
