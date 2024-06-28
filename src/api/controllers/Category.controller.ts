import { Request, Response } from 'express'
import { CategoryService } from '../services/Category.service'

export class CategoryController {
  private myService = new CategoryService()

  public async create(req: Request, res: Response) {
    const { name, namePt } = req.body
    const { status, message, data } = await this.myService.create({
      name,
      namePt,
    })

    return res.status(status).json({ message, data })
  }

  public async createMany(req: Request, res: Response) {
    const categories = req.body
    const { status, message, data } =
      await this.myService.createMany(categories)

    return res.status(status).json({ message, data })
  }

  public async readAll(_req: Request, res: Response) {
    const { status, message, data } = await this.myService.readAll()

    return res.status(status).json({ message, categories: data })
  }

  //   public async update(req: Request, res: Response) {}

  //   public async delete(req: Request, res: Response) {}
}
