import { Request, Response } from 'express'
import { LoginService } from '../services/Login.service'

export class LoginController {
  private myService = new LoginService()

  public async signIn(req: Request, res: Response) {
    const { email, password } = req.body
    const { status, message, userData } = await this.myService.signIn({
      email,
      password,
    })

    return res.status(status).json({ message, userData })
  }

  // ///////////////////////////////////////////////////////////////

  public async signOut(_req: Request, res: Response) {
    const { status, message } = await this.myService.signOut(res)

    return res.status(status).json({ message })
  }
}
