import { Router } from 'express';
import { healthRouter } from './healthRouter';
import { guardRouter } from './guardRouter';
import { userRouter } from './userRouter';
import { sessionRouter } from './sessionRouter';
import { systemRouter } from './systemRouter';

const routes = Router();

routes.use(guardRouter);
routes.use(healthRouter);
routes.use(sessionRouter);
routes.use(systemRouter);
routes.use(userRouter);

export { routes };
