import { Request, Response } from 'express'
import { UserService } from '../services/User.service'

export class UserController {
  private userService = new UserService()

  public async create(req: Request, res: Response) {
    const { status, message, data } = await this.userService.create(req.body)
    return res.status(status).json({ message, data })
  }

  public async read(_req: Request, res: Response) {
    const { status, message, data } = await this.userService.read()
    return res.status(status).json({ message, data })
  }

  public async readOne(req: Request, res: Response) {
    const { email } = req.body
    const { status, message, data } = await this.userService.readOne(email)
    return res.status(status).json({ message, data })
  }

  public async update(req: Request, res: Response) {
    const { email, name, password, phone } = req.body
    const { status, message, data } = await this.userService.update(
      email,
      name,
      password,
      phone,
    )
    return res.status(status).json({ message, data })
  }
}