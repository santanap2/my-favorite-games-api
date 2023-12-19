import express, { Request, Response } from 'express'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cors())

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello world funcionando' })
})

export default app
