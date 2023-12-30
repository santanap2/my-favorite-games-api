import { prismaClient } from '../../database/prismaClient'
import { IGame } from '../../interfaces'
import { isAuthenticatedValidation } from '../validations/CookieToken'
import { CartService } from './Cart.service'

export class OrderService {
  public async create(cookie?: string) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

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

  //   public async read(data: any) {}
  //
  //   public async update(data: any) {}
  //
  //   public async delete(data: any) {}
}
