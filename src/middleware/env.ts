import { z } from 'zod'

const EnvSchema = z.object({
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  NODE_ENV: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),

  // Email configuration
  EMAIL_HOST: z.string(),
  EMAIL_PORT: z.string().optional(),
  EMAIL_USER: z.string(),
  EMAIL_PASS: z.string(),

  // Frontend URL for password reset links
  FRONTEND_URL: z.url(),
})

export type Environment = z.infer<typeof EnvSchema>

export function parseEnv(data: any) {
  const { data: env, error } = EnvSchema.safeParse(data)

  if (error) {
    throw new Error(JSON.stringify(error))
  }

  return env
}
