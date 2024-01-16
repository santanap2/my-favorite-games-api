import { Request, Response, Router } from 'express'
import { EvaluationController } from '../controllers/Evaluation.controller'

export const evaluationRouter = Router()

const evaluationController = new EvaluationController()

evaluationRouter.post('/add-evaluation', (req: Request, res: Response) =>
  evaluationController.create(req, res),
)

evaluationRouter.get(
  '/get-game-evaluations/:gameId',
  (req: Request, res: Response) =>
    evaluationController.readGameEvaluations(req, res),
)

evaluationRouter.get('/get-user-evaluations', (req: Request, res: Response) =>
  evaluationController.readUserEvaluations(req, res),
)

evaluationRouter.get(
  '/get-user-evaluations/:evaluationId',
  (req: Request, res: Response) =>
    evaluationController.readOneUserEvaluation(req, res),
)
