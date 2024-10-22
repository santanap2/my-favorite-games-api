import { IEvaluation, IGame } from '../../interfaces'
import { EvaluationService } from '../services/Evaluation.service'
import { GameService } from '../services/Game.service'
import { UserService } from '../services/User.service'

export const validateEvaluationFields = ({ productId, stars }: IEvaluation) => {
  if (stars > 5 || stars < 0) {
    return {
      status: 400,
      message: 'As estrelas devem ser de 0 a 5',
      data: null,
    }
  }

  if (stars === undefined || stars === null)
    return { status: 400, message: 'Por favor insira as estrelas', data: null }

  if (!productId)
    return {
      status: 400,
      message: 'Por favor insira o Id do produto',
      data: null,
    }

  return null
}

export const validateEvaluationUser = async (userId: number) => {
  const { data: userExists } = await new UserService().readOne(userId)

  if (!userExists)
    return { status: 400, message: 'Usuário não cadastrado', data: null }

  return null
}

export const validateEvaluationProduct = async (productId: number) => {
  const { data: productExists } = await new GameService().readOne(productId)

  if (!productExists)
    return { status: 400, message: 'Produto não encontrado', data: null }

  return null
}

export const validateEvaluation = async (productId: number, userId: number) => {
  const { data: evaluationAlreadyExists } =
    await new EvaluationService().readOne(productId, userId)

  if (evaluationAlreadyExists)
    return {
      status: 400,
      message: 'Você só pode avaliar um produto uma vez.',
      data: null,
    }

  return null
}

export const validateProductIsBought = async (
  productId: number,
  userId: number,
) => {
  const { data: user } = await new UserService().readOne(userId)
  const boughtProducts: IGame[] = []
  user?.orders.forEach((order) => {
    if (order.status === 'concluded') boughtProducts.push(...order.products)
  })

  const productIsBought = boughtProducts.some(
    (product) => product.id === productId,
  )

  if (!productIsBought)
    return {
      status: 400,
      message: 'Você precisa ter comprado o produto para avaliá-lo',
      data: null,
    }

  return null
}

export const validateProductId = (gameId: string) => {
  if (!gameId)
    return {
      status: 400,
      message: 'Por favor forneça um Id de produto',
      data: null,
    }

  if (isNaN(Number(gameId)))
    return {
      status: 400,
      message: 'O Id de produto precisa ser um número',
      data: null,
    }

  return null
}

export const validateUserId = (userId: number) => {
  if (!userId)
    return {
      status: 400,
      message: 'Por favor forneça um Id de usuário',
      data: null,
    }

  if (typeof userId !== 'number')
    return {
      status: 400,
      message: 'O usuário está inválido',
      data: null,
    }

  return null
}

export const validateStars = (stars: number) => {
  if (!stars)
    return { status: 400, message: 'Por favor insira as estrelas', data: null }

  if (isNaN(stars))
    return {
      status: 400,
      message: 'As estrelas precisam ser um número',
      data: null,
    }

  return null
}
