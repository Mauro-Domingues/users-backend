import session from 'express-session';
import { RequestHandler } from 'express';
import { Redis } from 'ioredis';
import { RedisStore } from 'connect-redis';
import { convertToMilliseconds } from '@utils/convertToMilliseconds';
import { cryptoConfig } from '@config/crypto';

const redisClient = new Redis({
  port: Number(process.env.REDIS_PORT),
  host: process.env.REDIS_HOST,
  password: process.env.REDIS_PASSWORD,
  keyPrefix: process.env.REDIS_PREFIX,
});

export const sessionHandler: RequestHandler = session({
  name: 'sid',
  secret: cryptoConfig.config.crypto.secretKey,
  resave: false,
  saveUninitialized: false,
  rolling: false,
  unset: 'destroy',
  store: new RedisStore({ client: redisClient }),
  cookie: {
    maxAge: convertToMilliseconds('1h'),
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
  },
});
