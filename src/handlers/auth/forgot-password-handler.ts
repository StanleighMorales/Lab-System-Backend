// src/handlers/auth/forgot-password.handler.ts

import type { AppRouteHandler } from "@/lib/types/app-types";
import { forgotPasswordRoute } from "@/routes/auth/forgot-password.route";
import { AuthService } from "@/services/AuthService";
import * as httpStatusCodes from "@/openapi/http-status-codes";

/**
 * Handles the initial request to reset a password.
 * It takes an email, delegates to the AuthService, and always returns a generic
 * success message to prevent leaking information about registered users.
 */
export const ForgotPasswordHandler: AppRouteHandler<typeof forgotPasswordRoute> = async (c) => {
  const { email } = c.req.valid('json');

  try {

    const authService = new AuthService(c);


    await authService.requestResetPassword(email);


    return c.json(
      {
        message: 'If an account with that email exists, a password reset link has been sent.',
      },
      httpStatusCodes.OK,
    );
  }
  catch (err) {
 
    c.var.logger.error('Forgot password process failed internally', {
      error: (err as Error).message,
      email: email,
    });

    return c.json(
      {
        message: 'If an account with that email exists, a password reset link has been sent.',
      },
      httpStatusCodes.OK,
    );
  }
};