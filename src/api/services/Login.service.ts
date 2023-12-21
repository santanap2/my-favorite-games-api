import { prismaClient } from '../../database/prismaClient'
import { IUser } from '../../interfaces'
import { comparePasswords } from '../../utils/bcrypt'
import { generateToken } from '../../utils/jwt'
import { UserService } from './User.service'

export class LoginService {
  private userService = new UserService()

  public async requestLogin({ email, password }: IUser) {
    const { status, message, data } = await this.userService.readByEmail(email)

    if (!data) return { status, message }

    const passwordsCheck = await comparePasswords(password, data.password)

    if (!passwordsCheck)
      return { status: 401, message: 'A senha informada está incorreta' }

    const token = await generateToken({
      id: data.id,
      email,
      name: data.name,
      phone: data.phone,
    })

    await prismaClient.$disconnect()
    return { status: 200, message: 'Login efetuado com sucesso', token }
  }
}
