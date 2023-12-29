import { Request, Response, Router } from 'express'
import { LoginController } from '../controllers/Login.controller'

export const loginRouter = Router()

const loginController = new LoginController()

loginRouter.post('/login', (req: Request, res: Response) =>
  loginController.signIn(req, res),
)
