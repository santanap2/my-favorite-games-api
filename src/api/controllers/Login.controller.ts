import { Request, Response } from 'express'
import { LoginService } from '../services/Login.service'
import { setCookie } from 'nookies'

export class LoginController {
  private myService = new LoginService()

  public async signIn(req: Request, res: Response) {
    const { email, password } = req.body
    const { status, message, token } = await this.myService.signIn({
      email,
      password,
    })

    if (token) {
      setCookie({ res }, 'gamingPlatformAuth', token, {
        maxAge: 60 * 60 * 24, // 24 hours
        httpOnly: true,
        path: '/',
      })
    }

    return res.status(status).json({ message })
  }

  // ///////////////////////////////////////////////////////////////

  public async signOut(_req: Request, res: Response) {
    const { status, message } = await this.myService.signOut(res)

    return res.status(status).json({ message })
  }
}
