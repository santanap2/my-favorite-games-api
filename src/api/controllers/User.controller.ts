import { Request, Response } from 'express'
import { UserService } from '../services/User.service'

export class UserController {
  private userService = new UserService()

  public async create(req: Request, res: Response) {
    const { status, message, data } = await this.userService.create(req.body)
    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async read(_req: Request, res: Response) {
    const { status, message, data } = await this.userService.read()
    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(req: Request, res: Response) {
    const { id } = req.params
    const { status, message, data } = await this.userService.readOne(Number(id))

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readByToken(req: Request, res: Response) {
    const { cookie } = req.headers
    const { message, status, data } = await this.userService.readByToken(cookie)

    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async readByEmail(req: Request, res: Response) {
    const { email } = req.params

    const { status, message, data } = await this.userService.readByEmail(email)
    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async update(req: Request, res: Response) {
    const {
      name,
      currentEmail,
      newEmail,
      phone,
      currentPassword,
      newPassword,
    } = req.body

    const { status, message, data } = await this.userService.update(
      name,
      currentEmail,
      newEmail,
      phone,
      currentPassword,
      newPassword,
    )
    return res.status(status).json({ message, data })
  }
}
