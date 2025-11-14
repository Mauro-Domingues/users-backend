import type { PassportStatic } from 'passport';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { authConfig } from '@config/auth';

export const googleStrategy = (): PassportStatic => {
  return passport.use(
    new GoogleStrategy(
      authConfig.config.google,
      (_accessToken, _refreshToken, profile, done) => {
        return done(null, { email: profile._json.email });
      },
    ),
  );
};
