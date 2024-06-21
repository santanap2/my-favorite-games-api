import { Request, Response } from 'express'
import { GameService } from '../services/Game.service'

export class GameController {
  private myService = new GameService()

  public async create(req: Request, res: Response) {
    const { name, categoryId, price, image, description } = req.body
    const { status, message, data } = await this.myService.create({
      name,
      categoryId,
      price,
      image,
      description,
    })

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async createMany(req: Request, res: Response) {
    const arrayGames = req.body

    const { status, message, data } =
      await this.myService.createMany(arrayGames)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readWithFilters(req: Request, res: Response) {
    const { status, message, data } = await this.myService.readWithFilters(
      req.query,
    )

    return res.status(status).json({ message, games: data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(req: Request, res: Response) {
    const { id } = req.params
    const { status, message, data } = await this.myService.readOne(Number(id))

    return res.status(status).json({ message, game: data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readByName(req: Request, res: Response) {
    const { name } = req.params
    const { status, message, data } = await this.myService.readByName(name)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  //   public async update(req: Request, res: Response) {}

  //   public async delete(req: Request, res: Response) {}
}
