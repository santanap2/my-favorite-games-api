import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './api/routes/User.routes'
import { loginRouter } from './api/routes/Login.routes'
import { gameRouter } from './api/routes/Game.routes'
import { cartRouter } from './api/routes/Cart.routes'
import * as dotenv from 'dotenv'
import { orderRouter } from './api/routes/Order.routes'
import { favoritesRouter } from './api/routes/Favorite.routes'
import { categoryRouter } from './api/routes/Category.routes'
import { evaluationRouter } from './api/routes/Evaluation.routes'

dotenv.config()

const app = express()

app.use(express.json())
app.use(
  express.static('public', {
    setHeaders: (res) => {
      res.setHeader('Access-Control-Allow-Origin', '*')
    },
  }),
)
app.use(
  cors({
    credentials: true,
    origin: process.env.WEB_APP_URL,
  }),
)

app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({ message: 'API online and working fine' })
})

app.use(userRouter)
app.use(loginRouter)
app.use(gameRouter)
app.use(cartRouter)
app.use(orderRouter)
app.use(favoritesRouter)
app.use(categoryRouter)
app.use(evaluationRouter)

export default app
