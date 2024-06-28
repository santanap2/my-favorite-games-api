import { Request, Response } from 'express'
import { CartService } from '../services/Cart.service'

export class CartController {
  private myService = new CartService()

  public async read(req: Request, res: Response) {
    const { email } = req.query as { email: string }
    const { status, message, data } = await this.myService.read(email)

    return res.status(status).json({ message, cart: data })
  }

  // ///////////////////////////////////////////////////////////////

  public async create(req: Request, res: Response) {
    const { gameId, email } = req.body

    const { status, message, data } = await this.myService.create({
      gameId,
      email,
    })

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async buyOne(req: Request, res: Response) {
    const { gameId, email } = req.body

    const { status, message, data } = await this.myService.buyOne({
      gameId,
      email,
    })

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async removeItemCart(req: Request, res: Response) {
    const { gameId, email } = req.body
    const { message, status, data } = await this.myService.removeItemCart({
      gameId,
      email,
    })

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async emptyCart(req: Request, res: Response) {
    const { email } = req.body
    const { message, status } = await this.myService.emptyCart(email)

    return res.status(status).json({ message, status })
  }
}
