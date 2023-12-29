import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './api/routes/User.routes'
import { loginRouter } from './api/routes/Login.routes'
import { gameRouter } from './api/routes/Game.routes'
import { cartRouter } from './api/routes/Cart.routes'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(
  cors({
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    origin: process.env.WEB_APP_URL,
  }),
)

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API online and working fine' })
})

app.use(userRouter)
app.use(loginRouter)
app.use(gameRouter)
app.use(cartRouter)

export default app
