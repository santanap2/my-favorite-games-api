import express, { Request, Response } from 'express'
import cors from 'cors'
import { userRouter } from './api/routes/User.routes'
import { loginRouter } from './api/routes/Login.routes'
import { gameRouter } from './api/routes/Game.routes'

const app = express()

app.use(express.json())
app.use(express.static('public'))
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'API online and working fine' })
})

app.use(userRouter)
app.use(loginRouter)
app.use(gameRouter)

export default app
