import { Request, Response, Router } from 'express'
import { UserController } from '../controllers/User.controller'

export const userRouter = Router()

const userController = new UserController()

userRouter.get('/get-user-by-email/:email', (req: Request, res: Response) =>
  userController.readByEmail(req, res),
)

userRouter.post('/register', (req: Request, res: Response) =>
  userController.create(req, res),
)

userRouter.put('/update-user', (req: Request, res: Response) =>
  userController.update(req, res),
)
