import { Request, Response } from 'express'
import { EvaluationService } from '../services/Evaluation.service'

export class EvaluationController {
  private myService = new EvaluationService()

  public async create(req: Request, res: Response) {
    const { evaluation, email } = req.body
    const { status, message, data } = await this.myService.create(
      evaluation,
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
    const { evaluationId } = req.params
    const { email } = req.query

    const { status, message, data } =
      await this.myService.readOneUserEvaluation(evaluationId, email as string)

    return res.status(status).json({ message, evaluation: data })
  }

  // ///////////////////////////////////////////////////////////////

  public async update(req: Request, res: Response) {
    const { evaluationUpdate, email } = req.body

    const { status, message, data } = await this.myService.update({
      evaluationUpdate,
      email,
    })

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////
}
