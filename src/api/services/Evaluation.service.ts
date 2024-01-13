import { prismaClient } from '../../database/prismaClient'

export interface IEvaluation {
  description: string
  stars: number
  productId: number
  userId: number
}

export class EvaluationService {
  public async create(data: IEvaluation) {
    const { description, stars, productId, userId } = data

    const result = await prismaClient.evaluation.create({
      data: {
        description,
        stars,
        userId,
        productId,
      },
    })

    await prismaClient.$disconnect()
    return {
      status: 201,
      message: 'Avaliação adicionada com sucesso',
      data: result,
    }
  }

  // public async read(data: any) {}

  // public async update(data: any) {}

  // public async delete(data: any) {}
}
