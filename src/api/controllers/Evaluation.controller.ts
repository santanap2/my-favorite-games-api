import { Request, Response } from 'express'
import { EvaluationService } from '../services/Evaluation.service'

export class EvaluationController {
  private myService = new EvaluationService()

  public async create(req: Request, res: Response) {
    const { cookie } = req.headers
    const { description, stars, productId } = req.body
    const { status, message, data } = await this.myService.create(
      { description, stars, productId },
      cookie,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readGameEvaluations(req: Request, res: Response) {
    const { gameId } = req.params
    const { status, message, data } =
      await this.myService.readGameEvaluations(gameId)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readUserEvaluations(req: Request, res: Response) {
    const { cookie } = req.headers
    const { status, message, data } =
      await this.myService.readUserEvaluations(cookie)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readOneUserEvaluation(req: Request, res: Response) {
    const { cookie } = req.headers
    const { evaluationId } = req.params
    const { status, message, data } =
      await this.myService.readOneUserEvaluation(evaluationId, cookie)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async update(req: Request, res: Response) {
    const { cookie } = req.headers
    const { evaluationId, stars, description } = req.body

    const { status, message, data } = await this.myService.update(
      { evaluationId, stars, description },
      cookie,
    )

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////
}
