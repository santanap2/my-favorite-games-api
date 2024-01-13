import { Request, Response } from 'express'
import { EvaluationService } from '../services/Evaluation.service'

export class EvaluationController {
  private myService = new EvaluationService()

  public async create(req: Request, res: Response) {
    const { description, stars, productId, userId } = req.body
    const { status, message, data } = await this.myService.create({
      description,
      stars,
      productId,
      userId,
    })

    return res.status(status).json({ message, data })
  }

  // public async read(req: Request, res: Response) {}

  // public async update(req: Request, res: Response) {}

  // public async delete(req: Request, res: Response) {}
}
