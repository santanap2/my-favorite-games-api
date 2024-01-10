/* eslint-disable camelcase */
import { prismaClient } from '../../database/prismaClient'
import { ICardData, IGame, IQueryOrder } from '../../interfaces'
import { isAuthenticatedValidation } from '../validations/CookieToken'
import { CartService } from './Cart.service'

export class OrderService {
  public async create(
    paymentMethod: string,
    cardData: ICardData,
    cookie?: string,
  ) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    if (!paymentMethod)
      return {
        status: 400,
        message: 'Por favor informe o método de pagamento',
      }

    const { data: cart } = await new CartService().read(cookie)

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

      await new CartService().emptyCart(cookie)
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

  public async read(cookie?: string, queryParam?: IQueryOrder) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    const result = await prismaClient.order.findMany({
      where: { userId: data.id },
      include: { products: true },
    })

    if (!queryParam?.status) {
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

    if (queryParam.status === 'all') {
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

    const filteredOrders = result.filter(
      (order) => order.status === queryParam.status,
    )

    if (filteredOrders.length === 0)
      return {
        status: 404,
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

  public async readOne(id: string, cookie?: string) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    const result = await prismaClient.order.findUnique({
      where: {
        userId: data.id,
        id: Number(id),
      },
      include: { products: true },
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
  //
  //
  //   public async update(data: any) {}
  //
  //   public async delete(data: any) {}
}
