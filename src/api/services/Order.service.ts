/* eslint-disable @typescript-eslint/no-unused-vars */
import { prismaClient } from '../../database/prismaClient'
import { ICardData, IGame, IGameWithOrderInfo } from '../../interfaces'
import { CartService } from './Cart.service'
import { UserService } from './User.service'

export class OrderService {
  public async create(
    email: string,
    paymentMethod: string,
    cardData: ICardData,
  ) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    if (!paymentMethod)
      return {
        status: 400,
        message: 'Por favor informe o método de pagamento',
      }

    const { data: cart } = await new CartService().read(email)

    if (cart?.products && cart.products.length === 0)
      return {
        status: 400,
        message: 'Seu carrinho está vazio',
        data: null,
      }

    if (cart?.products && cart?.products.length > 0) {
      const games: IGame[] = cart.products
      const value = games.reduce((sum, product) => product.price + sum, 0)

      const result = await prismaClient.order.create({
        data: {
          products: {
            connect: games.map(
              ({ name, categoryId, price, image, description }) => ({
                name,
                categoryId,
                price,
                image,
                description,
              }),
            ),
          },
          payment_method: paymentMethod,
          status: 'awaitingPayment',
          user: { connect: { id: data.id } },
          value,
        },
        include: { products: true },
      })

      await new CartService().emptyCart(email)
      await prismaClient.$disconnect()
      return { status: 201, message: 'Pedido feito com sucesso', data: result }
    }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async read({
    email,
    filter,
  }: {
    email: string
    filter?: string | null
  }) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const result = await prismaClient.order.findMany({
      where: { userId: data.id },
      include: { products: true },
    })

    if (!filter) {
      if (!result)
        return {
          status: 500,
          message: 'Ocorreu um erro inesperado, por favor tente novamente',
          data: null,
        }

      return {
        status: 200,
        message:
          result.length === 0
            ? 'O usuário não possui nenhum pedido'
            : 'Pedidos encontrados com sucesso',
        data: result,
      }
    }

    if (filter === 'all') {
      if (result.length === 0)
        return {
          status: 200,
          message: 'O usuário nao possui nenhum pedido',
          data: result,
        }

      return {
        status: 200,
        message: 'Todos os pedidos',
        data: result,
      }
    }

    const filteredOrders = result.filter((order) => order.status === filter)

    if (filteredOrders.length === 0)
      return {
        status: 200,
        message: 'Não há nenhum pedido de acordo com os filtros',
        data: filteredOrders,
      }

    if (filteredOrders.length > 0)
      return {
        status: 200,
        message: 'Pedidos filtrados com sucesso',
        data: filteredOrders,
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(id: string, email: string) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const result = await prismaClient.order.findUnique({
      where: {
        userId: data.id,
        id: Number(id),
      },
      include: { products: { include: { category: true } } },
    })

    if (result)
      return {
        status: 200,
        message: 'Pedidos encontrado com sucesso',
        data: { ...result, user: data },
      }

    return {
      status: 404,
      message: 'Pedido não encontrado ou o usuário não possui autorização',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readBoughtProducts(email: string) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const result = await prismaClient.order.findMany({
      where: {
        userId: data.id,
      },
      include: {
        products: {
          include: { category: true },
        },
      },
    })

    const boughtProducts: IGameWithOrderInfo[] = []
    result.forEach((order) => {
      if (order.status === 'concluded') {
        const productWithOrderInfo = order.products.map((product) => ({
          ...product,
          orderInfo: {
            id: order.id,
            date: order.created_at,
          },
        }))
        boughtProducts.push(...productWithOrderInfo)
      }
    })

    if (result)
      return {
        status: 200,
        message: 'Produtos comprados encontrados com sucesso',
        data: boughtProducts,
      }

    return {
      status: 200,
      message: 'Pedido não encontrado ou o usuário não possui autorização',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////
}
