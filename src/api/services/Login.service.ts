import { destroyCookie } from 'nookies'
import { prismaClient } from '../../database/prismaClient'
import { IUser } from '../../interfaces'
import { comparePasswords } from '../../utils/bcrypt'
import { generateToken } from '../../utils/jwt'
import { UserService } from './User.service'
import { Response } from 'express'

export class LoginService {
  private userService = new UserService()

  public async signIn({ email, password }: IUser) {
    const { status, message, data } = await this.userService.readByEmail(email)
    if (!data) return { status, message }

    const user = await this.userService.readPassword(email)
    if (!user || !user.data?.password)
      return { status: 404, message: 'Usuário não encontrado' }

    const passwordsCheck = await comparePasswords(password, user.data?.password)
    if (!passwordsCheck)
      return { status: 401, message: 'A senha informada está incorreta' }

    const token = await generateToken({
      id: data.id,
      email: data.email,
      name: data.name,
      phone: data.phone,
    })

    await prismaClient.$disconnect()
    return { status: 200, message: 'Login efetuado com sucesso', token }
  }

  // ///////////////////////////////////////////////////////////////

  public async signOut(res: Response) {
    destroyCookie({ res }, 'gamingPlatformAuth')

    return {
      status: 200,
      message: 'Logout efetuado com sucesso',
    }
  }
}
