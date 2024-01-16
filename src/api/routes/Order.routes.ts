import { Request, Response, Router } from 'express'
import { OrderController } from '../controllers/Order.controller'

export const orderRouter = Router()

const orderController = new OrderController()

orderRouter.post('/create-order', (req: Request, res: Response) =>
  orderController.create(req, res),
)

orderRouter.get('/get-orders', (req: Request, res: Response) =>
  orderController.read(req, res),
)

orderRouter.get('/get-order/:id', (req: Request, res: Response) =>
  orderController.readOne(req, res),
)

orderRouter.get('/get-bought-products', (req: Request, res: Response) =>
  orderController.readBoughtProducts(req, res),
)
