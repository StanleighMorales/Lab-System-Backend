// src/services/MailerService.ts
import nodemailer from 'nodemailer'
import type { AppBindings } from '@/lib/types/app-types'

export class MailerService {
    private transporter: nodemailer.Transporter;
    private env: AppBindings['Bindings']; // Changed this to match Hono's convention

    // Make the constructor private to force using the factory method
    private constructor(env: AppBindings['Bindings']) {
        this.env = env
        // transporter is now initialized in the factory method before the constructor is called
        this.transporter = {} as nodemailer.Transporter; // Temporary assignment, will be overwritten
    }

    /**
     * Asynchronously creates and initializes a MailerService instance.
     * This is the correct way to instantiate the service.
     */
    public static async create(env: AppBindings['Bindings']): Promise<MailerService> {
        const service = new MailerService(env);

        if (env.NODE_ENV === 'production') {
            service.transporter = nodemailer.createTransport({
                host: env.EMAIL_HOST,
                port: parseInt(env.EMAIL_PORT || '587', 10),
                secure: (env.EMAIL_PORT === '465'),
                auth: {
                    user: env.EMAIL_USER,
                    pass: env.EMAIL_PASS,
                },
            });
        } else {
            // For development, we'll generate test credentials with Ethereal
            const testAccount = await nodemailer.createTestAccount();
            console.log('--- Ethereal Mail ---');
            console.log('Ethereal User:', testAccount.user);
            console.log('Ethereal Pass:', testAccount.pass);
            console.log('--------------------');

            service.transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user, // generated ethereal user
                    pass: testAccount.pass, // generated ethereal password
                },
            });
        }
        return service;
    }

    public async sendPasswordResetEmail(to: string, token: string) {
        const resetLink = `${this.env.FRONTEND_URL}/reset-password?token=${token}`;

        const mailOptions = {
            from: `"Your App Name" <no-reply@yourapp.com>`,
            to: to,
            subject: 'Reset Your Password',
            text: `You requested a password reset. Click this link to reset your password: ${resetLink}`,
            html: `<p>You requested a password reset. Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a><p>This link will expire in 1 hour.</p>`,
        };

        const info = await this.transporter.sendMail(mailOptions);

        if (this.env.NODE_ENV !== 'production') {
            console.log(`Ethereal mail preview URL: ${nodemailer.getTestMessageUrl(info)}`);
        }
    }
}