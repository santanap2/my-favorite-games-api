import { prismaClient } from '../../database/prismaClient'
import { IGame } from '../../interfaces'
import { validateGame } from '../validations/Cart'
import { isAuthenticatedValidation } from '../validations/CookieToken'
import { UserService } from './User.service'

export class FavoritesService {
  public async read(cookie?: string) {
    const { status, message, data } = await isAuthenticatedValidation(cookie)
    if (!data) return { status, message }

    const result = await prismaClient.favorite.findMany({
      where: { userId: data.id },
      include: { products: true },
    })

    let allFavorites: IGame[] = []
    result.forEach(
      (favorite) => (allFavorites = [...allFavorites, ...favorite.products]),
    )

    if (result)
      return {
        status: 200,
        message: 'Favoritos encontrados com sucesso',
        data: {
          userId: data.id,
          products: allFavorites,
        },
      }

    return {
      status: 404,
      message: 'Sem favoritos adicionados',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async manageFavorite(gameId: string, email: string) {
    const validation = await validateGame(Number(gameId))
    if (validation) return validation

    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }
    const userFavorites = data.favorites.map((item) => item.products[0])

    const alreadyFavorited = userFavorites.some(
      (products) => Number(products.id) === Number(gameId),
    )

    if (userFavorites && alreadyFavorited) {
      const removedFavorite = await this.delete(userFavorites, gameId, email)
      return removedFavorite
    }

    if (userFavorites && !alreadyFavorited) {
      const favoriteAdded = await this.create(gameId, email)
      return favoriteAdded
    }

    return {
      status: 500,
      message: 'Algum erro inesperado ocorreu, tente novamente',
      data: null,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async create(gameId: string, email: string) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const result = await prismaClient.favorite.create({
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
      message: 'Favorito adicionado com sucesso',
      data: result,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async delete(userFavorites: IGame[], gameId: string, email: string) {
    const user = new UserService()
    const { status, message, data } = await user.readByEmail(email)
    if (!data) return { status, message }

    const result = await prismaClient.favorite.deleteMany({
      where: {
        userId: data.id,
        products: { some: { id: Number(gameId) } },
      },
    })

    if (result)
      return {
        status: 200,
        message: 'Favorito removido com sucesso',
        data: userFavorites.filter((game) => game.id !== Number(gameId)),
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }
}
