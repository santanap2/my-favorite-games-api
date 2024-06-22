import { prismaClient } from '../../database/prismaClient'
import { validateGame } from '../validations/Cart'
import { UserService } from './User.service'

export class CartService {
  public async read(email: string) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const result = await prismaClient.cart.findUnique({
      where: { userId: data.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        products: { include: { category: true } },
      },
    })

    if (!result)
      return {
        status: 200,
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

  public async create({ gameId, email }: { email: string; gameId: string }) {
    const validation = await validateGame(Number(gameId))
    if (validation) return validation

    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const cartExists = await this.read(email)

    if (cartExists.message === 'Carrinho encontrado com sucesso') {
      const result = await prismaClient.cart.update({
        where: { userId: data.id },
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
        userId: data.id,
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

  public async buyOne({ gameId, email }: { email: string; gameId: string }) {
    const validation = await validateGame(Number(gameId))
    if (validation) return validation

    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const cartExists = await new CartService().read(email)

    if (cartExists.status === 200) {
      await this.emptyCart(email)

      const result = await prismaClient.cart.update({
        where: { userId: data.id },
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
        userId: data.id,
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

  public async removeItemCart({
    gameId,
    email,
  }: {
    email: string
    gameId: string
  }) {
    const validation = await validateGame(Number(gameId))
    if (validation) return validation

    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const cart = await this.read(email)

    if (cart?.data?.products) {
      const filteredGames = cart.data.products.filter(
        (game) => Number(game.id) !== Number(gameId),
      )

      const result = await prismaClient.cart.update({
        where: { userId: data.id },
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

  public async emptyCart(email: string) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const cart = await this.read(email)

    if (cart?.data?.products) {
      await prismaClient.cart.update({
        where: { userId: data.id },
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
