import { prismaClient } from '../../database/prismaClient'
import { IRegister } from '../../interfaces'
import { comparePasswords, hashPassword } from '../../utils/bcrypt'
import {
  createUserFieldsValidation,
  updateUserFieldsValidation,
} from '../validations/User'

export class UserService {
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

  public async read() {
    const result = await prismaClient.user.findMany()

    if (!result)
      return {
        status: 500,
        message: 'Ocorreu um erro inesperado, por favor tente novamente',
      }

    if (result.length === 0)
      return { status: 404, message: 'Sem usuários cadastrados' }

    await prismaClient.$disconnect()
    return {
      status: 200,
      message: 'Usuários encontrados com sucesso',
      data: result,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(id: number) {
    const result = await prismaClient.user.findUnique({
      where: { id },
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

  public async readByEmail(email: string) {
    const result = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!email)
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

  public async update(
    name: string | undefined,
    currentEmail: string,
    newEmail: string | undefined,
    phone: string | undefined,
    currentPassword: string,
    newPassword: string | undefined,
  ) {
    const validation = updateUserFieldsValidation(currentEmail, currentPassword)

    if (validation)
      return { status: validation.status, message: validation.message }

    const dataToUpdate: Record<string, unknown> = {}
    if (name) dataToUpdate.name = name
    if (newEmail) dataToUpdate.email = newEmail
    if (phone) dataToUpdate.phone = phone
    if (newPassword) dataToUpdate.password = newPassword

    const { data } = await this.readByEmail(currentEmail)
    if (!data)
      return {
        status: 404,
        message: 'Usuário não encontrado no banco de dados',
      }

    const passwordsCheck = await comparePasswords(
      currentPassword,
      data.password,
    )

    if (!passwordsCheck)
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
