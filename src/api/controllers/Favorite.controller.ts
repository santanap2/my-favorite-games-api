import { Request, Response } from 'express'
import { FavoritesService } from '../services/Favorite.service'

export class FavoritesController {
  private myService = new FavoritesService()

  public async read(req: Request, res: Response) {
    const { cookie } = req.headers
    const { status, message, data } = await this.myService.read(cookie)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async manageFavorite(req: Request, res: Response) {
    const { gameId, email } = req.body

    const { status, message } = await this.myService.manageFavorite(
      gameId,
      email,
    )

    return res.status(status).json({ message })
  }

  // ///////////////////////////////////////////////////////////////

  //
  //   public async update(req: Request, res: Response) {}
  //
  //   public async delete(req: Request, res: Response) {}
}
