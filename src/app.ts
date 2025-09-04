import express, { Request, Response } from 'express'
import cors from 'cors'
import { router } from './app/routes'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'
import { envVar } from './app/config/env.config'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: envVar.FRONTEND_URL,
    credentials: true
}))


app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Digital wallet server is running "
    })
})


app.use(globalErrorHandler)

app.use(notFound)
export default app