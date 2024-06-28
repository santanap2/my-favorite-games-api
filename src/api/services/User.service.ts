import { prismaClient } from '../../database/prismaClient'
import { IRegister, IUpdateUser } from '../../interfaces'
import { comparePasswords, hashPassword } from '../../utils/bcrypt'
import { isAuthenticatedValidation } from '../validations/CookieToken'
import {
  createUserFieldsValidation,
  updateUserFieldsValidation,
} from '../validations/User'

export class UserService {
  public async readOne(id: number) {
    const result = await prismaClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        created_at: true,
        cart: { include: { products: true } },
        favorites: { include: { products: true } },
        orders: { include: { products: true } },
        evaluations: true,
      },
    })

    if (!id)
      return {
        status: 400,
        message: 'Por favor forneça o parâmetro para busca',
      }

    if (!result) return { status: 404, message: 'Usuário não cadastrado' }

    await prismaClient.$disconnect()
    return {
      status: 200,
      message: 'Usuário encontrado com sucesso',
      data: result,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readByToken(cookie?: string) {
    const {
      status: statusValidation,
      message: messageValidation,
      data: dataValidation,
    } = await isAuthenticatedValidation(cookie)

    if (!dataValidation)
      return { status: statusValidation, message: messageValidation }

    const { status, data, message } = await this.readOne(dataValidation.id)

    return {
      status,
      message,
      data,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readByEmail(email: string) {
    if (!email)
      return {
        status: 400,
        message: 'Por favor forneça o parâmetro para busca',
      }

    const result = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!result) return { status: 200, message: 'Usuário não cadastrado' }

    const { status, data, message } = await this.readOne(result.id)

    await prismaClient.$disconnect()
    return {
      status,
      message,
      data,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readPassword(email: string) {
    const result = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!email)
      return {
        status: 400,
        message: 'Por favor forneça o parâmetro para busca',
      }

    if (!result) return { status: 404, message: 'Usuário não encontrado' }

    await prismaClient.$disconnect()
    return {
      status: 200,
      message: 'Usuário encontrado com sucesso',
      data: {
        id: result.id,
        password: result.password,
      },
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async create(user: IRegister) {
    const { email, name, password, phone } = user

    const validation = createUserFieldsValidation(email, name, password, phone)
    if (validation)
      return { status: validation.status, message: validation.message }

    const { data } = await this.readByEmail(email)
    if (data)
      return { status: 400, message: 'Email já cadastrado no banco de dados' }

    const encryptedPassword = await hashPassword(password)

    const result = await prismaClient.user.create({
      data: {
        email,
        password: encryptedPassword,
        name,
        phone,
      },
    })

    await prismaClient.cart.create({
      data: {
        user: {
          connect: {
            id: result.id,
          },
        },
      },
    })

    if (!result)
      return {
        status: 500,
        message: 'Ocorreu um erro inesperado, por favor tente novamente',
      }

    await prismaClient.$disconnect()
    return {
      status: 201,
      message: 'Usuário cadastrado com sucesso',
      data: result,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async update(userData: IUpdateUser, email: string) {
    const {
      data: dataValidation,
      status: statusValidation,
      message: messageValidation,
    } = await this.readByEmail(email)

    if (!dataValidation)
      return { status: statusValidation, message: messageValidation }

    const {
      name,
      currentEmail,
      newEmail,
      phone,
      currentPassword,
      newPassword,
    } = userData

    const validation = updateUserFieldsValidation(currentEmail, currentPassword)
    if (validation)
      return { status: validation.status, message: validation.message }

    const dataToUpdate: Record<string, unknown> = {}
    if (name) dataToUpdate.name = name
    if (newEmail) dataToUpdate.email = newEmail
    if (phone) dataToUpdate.phone = phone
    if (newPassword) dataToUpdate.password = await hashPassword(newPassword)

    const { data } = await this.readByEmail(currentEmail)
    const userPassword = await this.readPassword(currentEmail)
    if (!data)
      return {
        status: 404,
        message: 'Usuário não encontrado no banco de dados',
      }

    if (!userPassword || !userPassword.data?.password)
      return {
        status: 404,
        message: 'Usuário não encontrado no banco de dados',
      }

    const identicalPasswords = await comparePasswords(
      currentPassword,
      userPassword.data?.password,
    )

    if (!identicalPasswords)
      return { status: 401, message: 'A senha informada está incorreta' }

    const updatedUser = await prismaClient.user.update({
      where: { email: currentEmail },
      data: dataToUpdate,
    })

    await prismaClient.$disconnect()
    return {
      status: 200,
      message: 'Dados atualizados com sucesso',
      data: updatedUser,
    }
  }
}
