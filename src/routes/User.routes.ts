import { Router } from 'express'
import { UserController } from '../controllers/User.controller'

export const userRouter = Router()

const user = new UserController()

userRouter.post('/register', user.create)
