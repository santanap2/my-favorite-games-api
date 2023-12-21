import { Request, Response } from 'express'
import { LoginService } from '../services/Login.service'

export class LoginController {
  private myService = new LoginService()

  public async requestLogin(req: Request, res: Response) {
    const { email, password } = req.body
    const { status, message, token } = await this.myService.requestLogin({
      email,
      password,
    })

    return res.status(status).json({ message, token })
  }
}
