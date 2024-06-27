import { Request, Response } from 'express'
import { EvaluationService } from '../services/Evaluation.service'

export class EvaluationController {
  private myService = new EvaluationService()

  public async create(req: Request, res: Response) {
    const { description, stars, productId, email } = req.body
    const { status, message, data } = await this.myService.create(
      { description, stars, productId },
      email,
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
    const { email } = req.query
    const { status, message, data } = await this.myService.readUserEvaluations(
      email as string,
    )

    return res.status(status).json({ message, evaluations: data })
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
