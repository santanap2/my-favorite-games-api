import { Request, Response } from 'express'
import { OrderService } from '../services/Order.service'

export class OrderController {
  private myService = new OrderService()

  public async create(req: Request, res: Response) {
    const { cookie } = req.headers
    const { paymentMethod } = req.body
    const { status, message, data } = await this.myService.create(
      paymentMethod,
      cookie,
    )

    return res.status(status).json({ message, data })
  }

  public async read(req: Request, res: Response) {
    const { cookie } = req.headers
    const { status, message, data } = await this.myService.read(cookie)

    return res.status(status).json({ message, data })
  }
  //
  //   public async update(req: Request, res: Response) {}
  //
  //   public async delete(req: Request, res: Response) {}
}
