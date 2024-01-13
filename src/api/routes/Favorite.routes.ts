import { Request, Response, Router } from 'express'
import { FavoritesController } from '../controllers/Favorite.controller'

export const favoritesRouter = Router()

const favoritesController = new FavoritesController()

favoritesRouter.get('/get-all-favorites', (req: Request, res: Response) =>
  favoritesController.read(req, res),
)

favoritesRouter.put('/add-or-remove-favorite', (req: Request, res: Response) =>
  favoritesController.manageFavorite(req, res),
)
