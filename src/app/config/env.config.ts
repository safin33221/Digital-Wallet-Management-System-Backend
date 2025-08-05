import dotenv from 'dotenv'
dotenv.config()
interface IEnvConfig {
    PORT: string,
    MONGODB_URI: string,
    NODE_DEV: "DEVELOPMENT" | "PRODUCTION",
    BCRYPT_SLAT: string,
    JWT_SECRET: string,
    JWT_EXPIRES_IN: string,
    JWT_REFRESH_EXPIRES_IN: string,
}

const loadVariable = (): IEnvConfig => {
    const requiredEnvVariable: string[] = [
        "PORT",
        "MONGODB_URI",
        "NODE_DEV",
        "BCRYPT_SLAT",
        "JWT_SECRET",
        "JWT_EXPIRES_IN",
        "JWT_REFRESH_EXPIRES_IN",
    ]

    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required Env variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        NODE_DEV: process.env.NODE_Dev as "DEVELOPMENT" | "PRODUCTION",
        BCRYPT_SLAT: process.env.BCRYPT_SLAT as string,
        JWT_SECRET: process.env.JWT_SECRET as string,
        JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
        JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    }
}

export const envVar = loadVariable()

