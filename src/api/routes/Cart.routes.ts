import { Request, Response, Router } from 'express'
import { CartController } from '../controllers/Cart.controller'

export const cartRouter = Router()

const cartController = new CartController()

cartRouter.post('/add-to-cart', (req: Request, res: Response) =>
  cartController.create(req, res),
)

cartRouter.put('/buy-one-item', (req: Request, res: Response) =>
  cartController.buyOne(req, res),
)

cartRouter.get('/get-user-cart', (req: Request, res: Response) =>
  cartController.read(req, res),
)

cartRouter.put('/remove-from-cart', (req: Request, res: Response) =>
  cartController.removeItemCart(req, res),
)

cartRouter.put('/empty-cart', (req: Request, res: Response) =>
  cartController.emptyCart(req, res),
)
