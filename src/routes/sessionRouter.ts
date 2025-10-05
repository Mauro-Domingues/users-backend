import { Router } from 'express';
import { ForgotPasswordController } from '@modules/users/services/forgotPassword/ForgotPasswordController';
import { CheckTokenController } from '@modules/users/services/checkToken/CheckTokenController';
import { AuthenticateUserController } from '@modules/users/services/authenticateUser/AuthenticateUserController';
import { authenticateUser } from '@modules/users/validators/users/authenticateUser';
import { forgotPassword } from '@modules/users/validators/passwordResets/forgotPassword';
import { checkToken } from '@modules/users/validators/tokens/checkToken';
import { ChangePasswordController } from '@modules/users/services/changePassword/ChangePasswordController';
import { changePassword } from '@modules/users/validators/passwordResets/changePassword';
import { SocialAuthenticateUserController } from '@modules/users/services/socialAuthenticateUser/SocialAuthenticateUserController';
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { oauth2Request } from '@modules/users/validators/oauth2/oauth2Request';
import { oauth2Callback } from '@modules/users/validators/oauth2/oauth2Callback';

const sessionRouter = Router();
const socialAuthenticateUserController = new SocialAuthenticateUserController();
const authenticateUserController = new AuthenticateUserController();
const forgotPasswordController = new ForgotPasswordController();
const checkTokenController = new CheckTokenController();
const changePasswordController = new ChangePasswordController();

sessionRouter.get('/auth/google', oauth2Request, ensureAuthenticated('google'));
sessionRouter.get(
  '/auth/callback',
  oauth2Callback,
  ensureAuthenticated(['google']),
  socialAuthenticateUserController.handle,
);

sessionRouter.post(
  '/login',
  authenticateUser,
  authenticateUserController.handle,
);
sessionRouter.post(
  '/forgot-password',
  forgotPassword,
  forgotPasswordController.handle,
);
sessionRouter.post('/check-token', checkToken, checkTokenController.handle);
sessionRouter.patch(
  '/change-password',
  changePassword,
  changePasswordController.handle,
);

export { sessionRouter };
