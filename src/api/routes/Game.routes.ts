import { Request, Response, Router } from 'express'
import { GameController } from '../controllers/Game.controller'

export const gameRouter = Router()

const gameController = new GameController()

gameRouter.post('/add-game', (req: Request, res: Response) =>
  gameController.create(req, res),
)

gameRouter.post('/add-many-games', (req: Request, res: Response) =>
  gameController.createMany(req, res),
)

gameRouter.get('/get-games', (req: Request, res: Response) =>
  gameController.readWithFilters(req, res),
)

gameRouter.get('/get-game/:id', (req: Request, res: Response) =>
  gameController.readOne(req, res),
)

gameRouter.get('/get-game-by-name/:name', (req: Request, res: Response) =>
  gameController.readByName(req, res),
)
