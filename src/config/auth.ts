import { Joi } from 'celebrate';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { passportJwtSecret } from 'jwks-rsa';
import { StrategyOptions as GoogleStrategyOptions } from 'passport-google-oauth20';
import {
  ExtractJwt,
  StrategyOptionsWithoutRequest as JwtStrategyOptions,
} from 'passport-jwt';
import { appConfig } from './app';

interface IAuthConfigDTO {
  readonly config: {
    readonly jwt: JwtStrategyOptions;
    readonly google: GoogleStrategyOptions;
  };
}

const authValidator = Joi.object<IAuthConfigDTO>({
  config: Joi.object<IAuthConfigDTO['config']>({
    jwt: Joi.object<IAuthConfigDTO['config']['jwt']>({
      jwtFromRequest: Joi.function().arity(1).required(),
      algorithms: Joi.array()
        .items(
          Joi.string().valid(
            'HS256',
            'HS384',
            'HS512',
            'RS256',
            'RS384',
            'RS512',
            'ES256',
            'ES384',
            'ES512',
            'PS256',
            'PS384',
            'PS512',
            'none',
          ),
        )
        .min(1)
        .required(),
      secretOrKey: Joi.binary().when(Joi.ref('$apiMode'), {
        is: 'test',
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
      secretOrKeyProvider: Joi.function().arity(3).when(Joi.ref('$apiMode'), {
        not: 'test',
        then: Joi.required(),
        otherwise: Joi.forbidden(),
      }),
    }).required(),
    google: Joi.object<IAuthConfigDTO['config']['google']>({
      clientID: Joi.string().allow('').required(),
      clientSecret: Joi.string().allow('').required(),
      callbackURL: Joi.string().valid('callback').required(),
    }).required(),
  }).required(),
});

export const authConfig = Object.freeze<IAuthConfigDTO>({
  config: {
    jwt: {
      ...(() => {
        if (appConfig.config.apiMode === 'test') {
          return {
            secretOrKey: readFileSync(
              resolve(__dirname, '..', 'keys', 'public.pem'),
            ),
          };
        }
        return {
          secretOrKeyProvider: passportJwtSecret({
            jwksUri: `${appConfig.config.apiUrl}/jwks`,
            cache: true,
            rateLimit: true,
          }),
        };
      })(),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      algorithms: ['RS256'],
    },
    google: {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: 'callback',
    },
  },
});

authValidator.validateAsync(authConfig, {
  context: { apiMode: appConfig.config.apiMode },
});
