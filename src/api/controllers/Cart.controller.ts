import { Request, Response } from 'express'
import { CartService } from '../services/Cart.service'

export class CartController {
  private myService = new CartService()

  public async read(req: Request, res: Response) {
    const { cookie } = req.headers
    const { status, message, data } = await this.myService.read(cookie)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async create(req: Request, res: Response) {
    const { gameId } = req.body
    const { cookie } = req.headers

    const { status, message, data } = await this.myService.create(
      gameId,
      cookie,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async buyOne(req: Request, res: Response) {
    const { gameId } = req.body
    const { cookie } = req.headers

    const { status, message, data } = await this.myService.buyOne(
      gameId,
      cookie,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async removeItemCart(req: Request, res: Response) {
    const { gameId } = req.body
    const { cookie } = req.headers
    const { message, status, data } = await this.myService.removeItemCart(
      gameId,
      cookie,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async emptyCart(req: Request, res: Response) {
    const { gameId } = req.body
    const { cookie } = req.headers
    const { message, status } = await this.myService.emptyCart(gameId, cookie)

    return res.status(status).json({ message, status })
  }
}
