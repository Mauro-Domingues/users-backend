import passport from 'passport';
import { Router } from 'express';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { IExceptionDTO } from '@dtos/IExceptionDTO';
import { getExceptionOptions } from '@utils/getExceptionOptions';

const guardRouter = Router();

const paths: Array<IExceptionDTO> = [
  {
    url: '/health',
    methods: ['GET'],
  },
];

guardRouter.use(passport.initialize());
guardRouter.use(
  ensureAuthenticated('jwt').unless(getExceptionOptions({ paths })),
);

export { guardRouter };
