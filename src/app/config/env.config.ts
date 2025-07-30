import dotenv from 'dotenv'
dotenv.config()
interface IEnvConfig {
    PORT: string,
    MONGODB_URI: string,
    NODE_DEV: "DEVELOPMENT" | "PRODUCTION"
}

const loadVariable = (): IEnvConfig => {
    const requiredEnvVariable: string[] = [
        "PORT",
        "MONGODB_URI",
        "NODE_DEV",
    ]

    requiredEnvVariable.forEach(key => {
        if (!process.env[key]) {
            throw new Error(`Missing required Env variable ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        MONGODB_URI: process.env.MONGODB_URI as string,
        NODE_DEV: process.env.NODE_Dev as "DEVELOPMENT" | "PRODUCTION"
    }
}

export const envVar = loadVariable()

