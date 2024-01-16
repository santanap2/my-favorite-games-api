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

  public async readGameEvaluations(req: Request, res: Response) {
    const { gameId } = req.params
    const { status, message, data } =
      await this.myService.readGameEvaluations(gameId)

    return res.status(status).json({ message, data })
  }

  public async readUserEvaluations(req: Request, res: Response) {
    const { cookie } = req.headers
    const { status, message, data } =
      await this.myService.readUserEvaluations(cookie)

    return res.status(status).json({ message, data })
  }

  // public async update(req: Request, res: Response) {}

  // public async delete(req: Request, res: Response) {}
}
