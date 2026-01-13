import z from 'zod'

const envSchema = z.object({
    API_URL: z.string().min(1),
    API_BASE_URL: z.string().min(1),
    STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_HEDERA_TOPIC_ID: z.string().min(1),
})

export const env = envSchema.parse(import.meta.env)
