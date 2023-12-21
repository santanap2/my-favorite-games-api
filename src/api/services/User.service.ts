import { prismaClient } from '../../database/prismaClient'
import { IUser } from '../../interfaces'
import {
  createUserFieldsValidation,
  updateUserFieldsValidation,
} from '../validations/User'

export class UserService {
  public async create(user: IUser) {
    const { email, name, password, phone } = user

    const validation = createUserFieldsValidation(email, name, password, phone)
    if (validation)
      return { status: validation.status, message: validation.message }

    const { data } = await this.readOne(email)
    if (data) return { status: 400, message: 'User already exists in database' }

    const result = await prismaClient.user.create({
      data: {
        email,
        password,
        name,
        phone,
      },
    })

    if (!result)
      return { status: 500, message: 'An error ocurred, please try again!' }

    return { status: 201, message: 'User created successfully', data: result }
  }

  // ////////////////////////////////////////////////////////////////

  public async read() {
    const result = await prismaClient.user.findMany()

    if (!result)
      return { status: 500, message: 'An error ocurred, please try again!' }

    if (result.length === 0)
      return { status: 404, message: 'No registered users' }

    return { status: 200, message: 'Users found successfully', data: result }
  }

  // ////////////////////////////////////////////////////////////////

  public async readOne(email: string) {
    const result = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!email) return { status: 400, message: 'Param was not provided' }

    if (!result) return { status: 404, message: 'User not found in database' }
    return { status: 200, message: 'User found successfully', data: result }
  }

  // ////////////////////////////////////////////////////////////////

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

    const { data } = await this.readOne(currentEmail)
    if (!data)
      return {
        status: 404,
        message: 'Usuário não encontrado no banco de dados',
      }

    if (data.password !== currentPassword)
      return {
        status: 400,
        message: 'A senha informada está incorreta',
      }

    const updatedUser = await prismaClient.user.update({
      where: { email: currentEmail },
      data: dataToUpdate,
    })

    return {
      status: 200,
      message: 'Dados atualizados com sucesso',
      data: updatedUser,
    }
  }
}
