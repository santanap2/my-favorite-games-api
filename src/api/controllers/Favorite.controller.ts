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

  public async create(req: Request, res: Response) {
    const { gameId } = req.body
    const { cookie } = req.headers
    const { status, message } = await this.myService.create(gameId, cookie)

    return res.status(status).json({ message })
  }

  // ///////////////////////////////////////////////////////////////

  //
  //   public async update(req: Request, res: Response) {}
  //
  //   public async delete(req: Request, res: Response) {}
}
