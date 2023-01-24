import { z } from "zod";

export const EnvSchema = z.object({
    NODE_ENV: z.string().default("development"),
    BCRYPT_SALT: z.number().default(10),
    DB_NAME: z.string().default("lendsqr-demo-wallet"),
    DB_USER: z.string().default('root'),
    DB_PASSWORD: z.string().default('Password'),
    DB_PORT: z.string().default("3306").transform(Number),
    HOST: z.string().default("127.0.0.1"),
    TOKEN_SECRET: z.string().default('jwelwle'),
    APP_PORT: z.number().default(3000),
})