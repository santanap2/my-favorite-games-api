import { prismaClient } from '../database/prismaClient'
import { IUser } from '../interfaces'
import { userFieldsValidations } from './validations/User'

export class UserService {
  public async create(user: IUser) {
    const { email, name, password, phone } = user

    const validation = userFieldsValidations(email, name, password, phone)
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

    return { status: 200, message: 'Users found successfully', data: result }
  }

  // ////////////////////////////////////////////////////////////////

  public async readOne(email: string) {
    const result = await prismaClient.user.findUnique({
      where: { email },
    })

    if (!result) return { status: 404, message: 'User not found in database' }
    return { status: 200, message: 'User found successfully', data: result }
  }

  // ////////////////////////////////////////////////////////////////

  public async update(
    email: string,
    name: string,
    password: string,
    phone: string,
  ) {
    const { data } = await this.readOne(email)
    if (!data) return { status: 400, message: 'User not found in database' }

    const updatedUser = await prismaClient.user.update({
      where: { email },
      data: {
        name,
        password,
        phone,
      },
    })

    return {
      status: 200,
      message: 'User updated successfully',
      data: updatedUser,
    }
  }
}
