import { Request, Response } from 'express'
import { UserService } from '../services/User.service'

export class UserController {
  private userService = new UserService()

  public async readByEmail(req: Request, res: Response) {
    const { email } = req.params

    const { status, message, data } = await this.userService.readByEmail(email)
    return res.status(status).json({ message, user: data })
  }

  // ///////////////////////////////////////////////////////////////

  public async create(req: Request, res: Response) {
    const { status, message, data } = await this.userService.create(req.body)
    return res.status(status).json({ message, data })
  }

  // ///////////////////////////////////////////////////////////////

  public async update(req: Request, res: Response) {
    const {
      userData: {
        name,
        currentEmail,
        newEmail,
        phone,
        currentPassword,
        newPassword,
      },
      userEmail,
    } = req.body

    const { status, message, data } = await this.userService.update(
      {
        name,
        currentEmail,
        newEmail,
        phone,
        currentPassword,
        newPassword,
      },
      userEmail,
    )
    return res.status(status).json({ message, data })
  }
}
