import { z } from "zod"

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    // API_URL: z.string().url().startsWith('https://'),
    // APP_ID: z.string().uuid(),
    AUTH_SECRET: z.string().min(1),
    // SECRET_API_KEY: z.string().min(1),
    AUTH_URL: z.string().url(),
})