import express, { Request, Response } from 'express'
import cors from 'cors'
import { router } from './app/routes'
import { globalErrorHandler } from './app/middleware/globalErrorHandler'
import { notFound } from './app/middleware/notFound'

const app = express()

app.use(express.json())
app.use(cors())


app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        message: "Digital wallet server is running "
    })
})


app.use(globalErrorHandler)

app.use(notFound)
export default app