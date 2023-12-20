import { Request, Response, Router } from 'express'
import { UserController } from '../controllers/User.controller'

export const userRouter = Router()

const user = new UserController()

userRouter.post('/register', (req: Request, res: Response) =>
  user.create(req, res),
)

userRouter.get('/get-all-users', (req: Request, res: Response) =>
  user.read(req, res),
)

userRouter.get('/get-user', (req: Request, res: Response) =>
  user.readOne(req, res),
)

userRouter.put('/update-user', (req: Request, res: Response) =>
  user.update(req, res),
)
