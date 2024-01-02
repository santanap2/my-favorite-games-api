/* eslint-disable camelcase */
import { prismaClient } from '../../database/prismaClient'
import { IGame, IQueryOrder } from '../../interfaces'
import { isAuthenticatedValidation } from '../validations/CookieToken'
import { CartService } from './Cart.service'

export class OrderService {
  public async create(paymentMethod: string, cookie?: string) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    if (!paymentMethod)
      return {
        status: 400,
        message: 'Por favor informe o método de pagamento',
      }

    const { data: cart } = await new CartService().read(cookie)

    if (cart) {
      const games: IGame[] = cart.products
      const value = games.reduce((sum, product) => product.price + sum, 0)

      const result = await prismaClient.order.create({
        data: {
          products: {
            connect: games.map(
              ({ name, genre, genrePt, price, image, description }) => ({
                name,
                genre,
                genrePt,
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

      await prismaClient.$disconnect()
      return { status: 201, message: 'Pedido feito com sucesso', data: result }
    }

    return {
      status: 400,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }

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

      if (result.length === 0)
        return {
          status: 404,
          message: 'O usuário não possui nenhum pedido',
          data: null,
        }

      return {
        status: 200,
        message: 'Pedidos encontrados com sucesso',
        data: result,
      }
    }

    if (queryParam.status === 'all')
      return {
        status: 200,
        message: 'Todos os pedidos',
        data: result,
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
  //
  //
  //   public async update(data: any) {}
  //
  //   public async delete(data: any) {}
}
