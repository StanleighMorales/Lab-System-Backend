    import { createRoute, z } from "@hono/zod-openapi";
    import jsonContent, { jsonContentRequired } from "@/middleware/utils/json-content";
    import * as httpStatusCodes from "@/openapi/http-status-codes";

    const ForgotPasswordSchema = z.object({
        email: z.email().min(1),
    })

    export const forgotPasswordRoute = createRoute({
    tags: ['Auth'],
    method: 'post',
    path: '/forgot-password',
    summary: 'Initiate the password reset process for a user.',
    request: {
        body: jsonContentRequired(
        ForgotPasswordSchema,
        'The user\'s email to send the reset link to.',
        ),
    },
    responses: {
        [httpStatusCodes.OK]: jsonContent(
        z.object({
            message: z.string().openapi({
            example: 'If an account with that email exists, a password reset link has been sent.',
            }),
        }),
        'Request received. A generic message is always returned for security.',
        ),
        [httpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
            z.object({ message: z.string() }),
            'Internal Server Error'
        ),
    },
    })


    export type ForgotPassword = typeof forgotPasswordRoute;
