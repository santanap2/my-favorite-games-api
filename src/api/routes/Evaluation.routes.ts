import { Request, Response, Router } from 'express'
import { EvaluationController } from '../controllers/Evaluation.controller'

export const evaluationRouter = Router()

const evaluationController = new EvaluationController()

evaluationRouter.post('/add-evaluation', (req: Request, res: Response) =>
  evaluationController.create(req, res),
)
