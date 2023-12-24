import { prismaClient } from '../../database/prismaClient'
import { ICartItem } from '../../interfaces'
import { validateUserAndGame } from '../validations/Cart'

export class CartService {
  public async create(data: ICartItem) {
    const { gameId, userId } = data

    const validation = await validateUserAndGame(Number(userId), Number(gameId))
    if (validation) return validation

    const cartExists = await new CartService().read(Number(userId))

    if (cartExists.status === 200) {
      const result = await prismaClient.cart.update({
        where: { userId: Number(userId) },
        data: {
          products: {
            connect: { id: Number(gameId) },
          },
        },
        include: {
          user: { select: { id: true, name: true, email: true } },
          products: true,
        },
      })

      return {
        status: 200,
        message: 'Carrinho atualizado com sucesso',
        data: { user: result.user, products: result.products },
      }
    }

    const result = await prismaClient.cart.create({
      data: {
        userId: Number(userId),
        products: {
          connect: { id: Number(gameId) },
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true,
      },
    })

    await prismaClient.$disconnect()
    return {
      status: 201,
      message: 'Carrinho criado e item adicionado com sucesso',
      data: { user: result.user, products: result.products },
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async read(userId: number) {
    if (isNaN(userId))
      return {
        status: 400,
        message: 'Insira um usuário válido',
      }

    const result = await prismaClient.cart.findUnique({
      where: { userId: Number(userId) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: true,
      },
    })

    if (!result)
      return {
        status: 404,
        message: 'Carrinho não encontrado',
      }

    if (result)
      return {
        status: 200,
        message: 'Carrinho encontrado com sucesso',
        data: { user: result.user, products: result.products },
      }

    await prismaClient.$disconnect()
    return {
      status: 500,
      message: 'Ocorreu um erro inesperado',
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async removeItemCart(data: ICartItem) {
    const { gameId, userId } = data

    const validation = await validateUserAndGame(Number(userId), Number(gameId))
    if (validation) return validation

    const cart = await this.read(Number(userId))

    if (cart?.data?.products) {
      const filteredGames = cart.data.products.filter(
        (game) => Number(game.id) !== Number(gameId),
      )

      const result = await prismaClient.cart.update({
        where: { userId: Number(userId) },
        data: {
          products: {
            set: filteredGames,
          },
        },
        include: {
          products: true,
          user: { select: { id: true, name: true, email: true } },
        },
      })

      return {
        status: 200,
        message: 'Jogo ausente ou excluído com sucesso',
        data: { user: result.user, products: result.products },
      }
    }

    if (!cart?.data?.products)
      return {
        status: 400,
        message: 'Carrinho já está vazio',
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async emptyCart(data: ICartItem) {
    const { userId, gameId } = data

    const validation = await validateUserAndGame(Number(userId), Number(gameId))
    if (validation) return validation

    const cart = await this.read(Number(userId))

    if (cart?.data?.products) {
      await prismaClient.cart.update({
        where: { userId: Number(userId) },
        data: {
          products: {
            set: [],
          },
        },
        include: { products: true },
      })

      if (!cart?.data?.products)
        return {
          status: 400,
          message: 'Carrinho já está vazio',
        }

      return {
        status: 200,
        message: 'Carrinho esvaziado com sucesso',
      }
    }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
    }
  }
}
