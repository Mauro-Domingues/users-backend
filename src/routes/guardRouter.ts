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
  {
    url: '/generate-keys',
    methods: ['GET'],
  },
  {
    url: '/login',
    methods: ['POST'],
  },
  {
    url: '/forgot-password',
    methods: ['POST'],
  },
  {
    url: '/check-token',
    methods: ['POST'],
  },
  {
    url: '/register',
    methods: ['POST'],
  },
  {
    url: '/auth/callback',
    methods: ['GET'],
  },
  {
    url: '/auth/google',
    methods: ['GET'],
  },
];

guardRouter.use(passport.initialize());
guardRouter.use(
  ensureAuthenticated('jwt').unless(getExceptionOptions({ paths })),
);

export { guardRouter };
