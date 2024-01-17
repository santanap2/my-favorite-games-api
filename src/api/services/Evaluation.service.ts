import { prismaClient } from '../../database/prismaClient'
import { IEvaluation, IEvaluationUpdate } from '../../interfaces'
import { isAuthenticatedValidation } from '../validations/CookieToken'
import {
  validateEvaluationFields,
  validateEvaluation,
  validateEvaluationProduct,
  validateEvaluationUser,
  validateProductIsBought,
  validateProductId,
  validateUserId,
  validateStars,
} from '../validations/Evaluation'

export class EvaluationService {
  public async create({ description, stars, productId, userId }: IEvaluation) {
    const fieldsValidationError = validateEvaluationFields({
      stars,
      productId,
      userId,
    })
    if (fieldsValidationError) return fieldsValidationError

    const userDoesNotExist = await validateEvaluationUser(userId)
    if (userDoesNotExist) return userDoesNotExist

    const productDoesNotExist = await validateEvaluationProduct(productId)
    if (productDoesNotExist) return productDoesNotExist

    const alreadyEvaluated = await validateEvaluation(productId, userId)
    if (alreadyEvaluated) return alreadyEvaluated

    const productIsNotBought = await validateProductIsBought(productId, userId)
    if (productIsNotBought) return productIsNotBought

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

  // ///////////////////////////////////////////////////////////////

  public async readOne(productId: number, userId: number) {
    const result = await prismaClient.evaluation.findFirst({
      where: {
        userId,
        productId,
      },
    })

    if (!result)
      return {
        status: 404,
        message: 'Avaliação não encontrada',
        data: null,
      }

    if (result)
      return {
        status: 200,
        message: 'Avaliação encontrada com sucesso',
        data: result,
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente.',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readGameEvaluations(gameId: string) {
    const invalidGameId = validateProductId(gameId)
    if (invalidGameId) return invalidGameId

    const result = await prismaClient.evaluation.findMany({
      where: {
        productId: Number(gameId),
      },
      include: {
        user: {
          select: { name: true },
        },
      },
    })

    if (result.length === 0)
      return {
        status: 404,
        message: 'Produto sem nenhuma avaliação',
        data: result,
      }

    if (result)
      return {
        status: 200,
        message: 'Avaliações do produto encontradas com sucesso',
        data: result,
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readUserEvaluations(cookie?: string) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    const invalidUserId = validateUserId(data.id)
    if (invalidUserId) return invalidUserId

    const result = await prismaClient.evaluation.findMany({
      where: {
        userId: data.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            category: { select: { name: true, namePt: true } },
          },
        },
      },
    })

    if (result.length === 0)
      return {
        status: 404,
        message: 'O usuário não fez nenhuma avaliação',
        data: result,
      }

    if (result)
      return {
        status: 200,
        message: 'Avaliações do usuário encontradas com sucesso',
        data: result,
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readOneUserEvaluation(evaluationId: string, cookie?: string) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    const result = await prismaClient.evaluation.findUnique({
      where: {
        id: Number(evaluationId),
        userId: data.id,
      },
      include: { product: true },
    })

    if (result)
      return {
        status: 200,
        message: 'Avaliação encontrada com sucesso',
        data: result,
      }

    if (!result)
      return {
        status: 404,
        message: 'Avaliação não encontrada',
        data: null,
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async update(
    { evaluationId, stars, description }: IEvaluationUpdate,
    cookie?: string,
  ) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    const invalidStars = validateStars(stars)
    if (invalidStars) return invalidStars

    const result = await prismaClient.evaluation.update({
      where: {
        id: evaluationId,
        userId: data.id,
      },
      data: {
        description,
        stars,
      },
    })

    if (result)
      return {
        status: 200,
        message: 'Avaliação atualizada com sucesso',
        data: result,
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }

  // ////////////////////////////////////////////////////////////
}
