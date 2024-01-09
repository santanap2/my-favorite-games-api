import { Request, Response, Router } from 'express'
import { CategoryController } from '../controllers/Category.controller'

export const categoryRouter = Router()

const categoryController = new CategoryController()

categoryRouter.post('/create-category', (req: Request, res: Response) =>
  categoryController.create(req, res),
)

categoryRouter.post('/create-categories', (req: Request, res: Response) =>
  categoryController.createMany(req, res),
)
