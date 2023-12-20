import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './routes/User.routes'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API online and working fine' })
})

app.use(userRouter)

export default app
