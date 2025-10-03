import { authConfig } from '@config/auth';
import passport, { PassportStatic } from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

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
