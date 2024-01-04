import { Request, Response } from 'express'
import { OrderService } from '../services/Order.service'

export class OrderController {
  private myService = new OrderService()

  public async create(req: Request, res: Response) {
    const { cookie } = req.headers
    const {
      data: { paymentMethod, cardData },
    } = req.body
    const { status, message, data } = await this.myService.create(
      paymentMethod,
      cardData,
      cookie,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async read(req: Request, res: Response) {
    const queryParam = req.query
    const { cookie } = req.headers
    const { status, message, data } = await this.myService.read(
      cookie,
      queryParam,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(req: Request, res: Response) {
    const { id } = req.params
    const { cookie } = req.headers
    const { status, message, data } = await this.myService.readOne(id, cookie)

    return res.status(status).json({ message, data })
  }
  //
  //   public async update(req: Request, res: Response) {}
  //
  //   public async delete(req: Request, res: Response) {}
}
