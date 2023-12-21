import { Request, Response, Router } from 'express'
import { UserController } from '../controllers/User.controller'

export const userRouter = Router()

const userController = new UserController()

userRouter.post('/register', (req: Request, res: Response) =>
  userController.create(req, res),
)

userRouter.get('/get-all-users', (req: Request, res: Response) =>
  userController.read(req, res),
)

userRouter.get('/get-user/:email', (req: Request, res: Response) =>
  userController.readOne(req, res),
)

userRouter.put('/update-user', (req: Request, res: Response) =>
  userController.update(req, res),
)
