import { Request, Response } from 'express'
import { prismaClient } from '../database/prismaClient'

export class UserController {
  async create(req: Request, res: Response) {
    const { email, password, name, phone } = req.body

    const user = await prismaClient.user.create({
      data: {
        email,
        password,
        name,
        phone,
      },
    })

    return res.status(201).json(user)
  }
}
