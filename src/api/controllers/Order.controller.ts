import { Request, Response } from 'express'
import { OrderService } from '../services/Order.service'

export class OrderController {
  private myService = new OrderService()

  public async create(req: Request, res: Response) {
    const { email } = req.query as {
      email: string
    }
    const {
      data: { paymentMethod, cardData },
    } = req.body
    const { status, message, data } = await this.myService.create(
      paymentMethod,
      cardData,
      email,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async read(req: Request, res: Response) {
    const { email, filter } = req.query as {
      email: string
      filter?: string | null
    }

    const { status, message, data } = await this.myService.read({
      email,
      filter,
    })

    return res.status(status).json({ message, orders: data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(req: Request, res: Response) {
    const { id } = req.params
    const { cookie } = req.headers
    const { status, message, data } = await this.myService.readOne(id, cookie)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readBoughtProducts(req: Request, res: Response) {
    const { cookie } = req.headers
    const { status, message, data } =
      await this.myService.readBoughtProducts(cookie)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////
}
