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
app.use(express.static('public'))
app.use(
  cors({
    credentials: true,
    allowedHeaders: ['content-type', 'Access-Control-Allow-Origin'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    origin: 'https://myfavgames.netlify.app/home',
    // origin: 'http://192.168.1.15:3000',
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
