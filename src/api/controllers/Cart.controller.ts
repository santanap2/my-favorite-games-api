import { Request, Response } from 'express'
import { CartService } from '../services/Cart.service'

export class CartController {
  private myService = new CartService()

  public async create(req: Request, res: Response) {
    const { gameId } = req.body
    const { userId } = req.params

    const { status, message, data } = await this.myService.create({
      gameId,
      userId,
    })

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async buyOne(req: Request, res: Response) {
    const { gameId } = req.body
    const { userId } = req.params

    const { status, message, data } = await this.myService.buyOne({
      gameId,
      userId,
    })

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async read(req: Request, res: Response) {
    const { userId } = req.params
    const { status, message, data } = await this.myService.read(Number(userId))

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async removeItemCart(req: Request, res: Response) {
    const { userId } = req.params
    const { gameId } = req.body
    const { message, status, data } = await this.myService.removeItemCart({
      gameId,
      userId,
    })

    return res.status(status).json({ message, data })
  }
  // ///////////////////////////////////////////////////////////////

  public async emptyCart(req: Request, res: Response) {
    const { userId } = req.params
    const { gameId } = req.body
    const { message, status } = await this.myService.emptyCart({
      gameId,
      userId,
    })

    return res.status(status).json({ message, status })
  }

  // ///////////////////////////////////////////////////////////////

  //   public async update(req: Request, res: Response) {}
  //
  //   public async delete(req: Request, res: Response) {}
}
