import { Request, Response } from 'express'
import { OrderService } from '../services/Order.service'

export class OrderController {
  private myService = new OrderService()

  public async create(req: Request, res: Response) {
    const { paymentMethod, cardData, email } = req.body

    const { status, message, data } = await this.myService.create(
      email,
      paymentMethod,
      cardData,
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
    const { email } = req.query as { email: string }

    const { status, message, data } = await this.myService.readOne(id, email)

    return res.status(status).json({ message, order: data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readBoughtProducts(req: Request, res: Response) {
    const { email } = req.query
    const { status, message, data } = await this.myService.readBoughtProducts(
      email as string,
    )

    return res.status(status).json({ message, boughtGames: data })
  }

  // ///////////////////////////////////////////////////////////////
}
