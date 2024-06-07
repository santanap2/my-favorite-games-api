import { destroyCookie } from 'nookies'
import { prismaClient } from '../../database/prismaClient'
import { IUser } from '../../interfaces'
import { comparePasswords } from '../../utils/bcrypt'
// import { generateToken } from '../../utils/jwt'
import { UserService } from './User.service'
import { Response } from 'express'

export class LoginService {
  private userService = new UserService()

  public async signIn({ email, password }: IUser) {
    const { status, data } = await this.userService.readByEmail(email)
    if (!data) return { status, message: 'As credenciais estão incorretas' }

    const user = await this.userService.readPassword(email)
    if (!user || !user.data?.password)
      return { status: 400, message: 'As credenciais estão incorretas' }

    const passwordsCheck = await comparePasswords(password, user.data?.password)
    if (!passwordsCheck)
      return { status: 400, message: 'As credenciais estão incorretas' }

    if (passwordsCheck) {
      // const token = await generateToken({
      //   id: data.id,
      //   email: data.email,
      //   name: data.name,
      //   phone: data.phone,
      // })

      await prismaClient.$disconnect()
      return {
        status: 200,
        message: 'Login efetuado com sucesso',
        userData: {
          id: data.id,
          email: data.email,
          name: data.name,
        },
      }
    }

    return { status: 500, message: 'Ocorreu um erro inesperado' }
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
