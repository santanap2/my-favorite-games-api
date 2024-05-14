/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prismaClient } from '../../database/prismaClient'
import { IFilters, IGame, IGameApi, IQueryObject } from '../../interfaces'
import { createGameFieldsValidation } from '../validations/Game'

export class GameService {
  public async create(game: IGame) {
    const { name, categoryId, price, image, description } = game

    const validation = createGameFieldsValidation(game)
    if (validation)
      return { status: validation.status, message: validation.message }

    const { data } = await this.readByName(encodeURIComponent(name))
    if (data)
      return { status: 400, message: 'Jogo já adicionado no banco de dados' }

    const result = await prismaClient.game.create({
      data: { name, categoryId, price, image, description },
    })

    if (!result)
      return {
        status: 500,
        message: 'Ocorreu um erro inesperado, por favor tente novamente',
      }

    await prismaClient.$disconnect()
    return { status: 201, message: 'Jogo adicionado com sucesso', data: result }
  }

  // ///////////////////////////////////////////////////////////////

  public async createMany(games: IGame[]) {
    if (!Array.isArray(games))
      return { status: 400, message: 'Por favor insira um array de jogos' }

    const result = await prismaClient.game.createMany({
      data: [...games],
      skipDuplicates: true,
    })

    if (!result)
      return {
        status: 500,
        message: 'Ocorreu um erro inesperado, por favor tente novamente',
      }

    const allGames = await this.readWithFilters()

    await prismaClient.$disconnect()
    return {
      status: 201,
      message:
        result.count === 0
          ? 'Nenhum jogo adicionado pois já existem no banco de dados'
          : `${result.count} Jogos adicionados com sucesso`,
      data: allGames.data,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(id: number) {
    if (isNaN(id)) return { status: 400, message: 'Insira um ID válido' }

    const result = await prismaClient.game.findUnique({
      where: { id },
      include: {
        category: true,
        evaluations: { include: { user: { select: { name: true } } } },
      },
    })

    if (!result)
      return {
        status: 404,
        message: 'Jogo não encontrado',
      }

    await prismaClient.$disconnect()
    return { status: 200, message: 'Jogo encontrado', data: result }
  }

  // ///////////////////////////////////////////////////////////////

  public async readByName(name: string) {
    if (!name) return { status: 400, message: 'Insira um nome válido' }

    const result = await prismaClient.game.findUnique({
      where: { name },
      include: { category: true },
    })

    if (!result)
      return {
        status: 404,
        message: 'Jogo não encontrado',
      }

    await prismaClient.$disconnect()
    return { status: 200, message: 'Jogo encontrado', data: result }
  }

  // ///////////////////////////////////////////////////////////////

  public async readWithFilters(queryObject?: IQueryObject) {
    const allGames = await prismaClient.game.findMany({
      include: {
        category: true,
      },
    })

    if (!queryObject) {
      if (!allGames)
        return {
          status: 500,
          message: 'Ocorreu um erro inesperado, por favor tente novamente',
        }

      if (allGames.length === 0)
        return { status: 404, message: 'Sem jogos adicionados' }

      return {
        status: 200,
        message: 'Jogos encontrados',
        data: allGames,
      }
    }

    if (queryObject.busca != null && queryObject.busca !== '') {
      const filteredByName = allGames.filter((game) =>
        game.name.toLowerCase().includes(queryObject.busca!.toLowerCase()),
      )

      if (filteredByName.length === 0)
        return {
          status: 404,
          message: 'Nenhum jogo encontrado',
          data: filteredByName,
        }

      return {
        status: 200,
        message: 'Jogos encontrados pela busca',
        data: filteredByName,
      }
    }

    const transformQueryToObject = () => {
      const params = new URLSearchParams()
      Object.entries(queryObject || {}).forEach(([key, value]) => {
        params.set(key, value)
      })

      const filtersObject: Record<string, string | boolean | null> = {}
      params.forEach((value, key) => {
        filtersObject[key] =
          value === 'true'
            ? true
            : value === 'false'
              ? false
              : value === ''
                ? null
                : value
      })
      return filtersObject
    }

    const changedFilters = (lateralFilters: IFilters) => {
      const keys = Object.keys(lateralFilters)
      const values = Object.values(lateralFilters)
      const result = keys.filter((_key, index) => values[index] === true)
      return result
    }

    const filterGames = (
      games: IGameApi[],
      genres: string[],
      minPrice: string | boolean | null,
      maxPrice: string | boolean | null,
    ) => {
      const minPriceNumber =
        typeof minPrice === 'string' ? Number(minPrice) : null
      const maxPriceNumber =
        typeof maxPrice === 'string' ? Number(maxPrice) : null

      const gamesFiltrados = games.filter((game: IGameApi) => {
        const areaCondition =
          genres.length === 0 || genres.includes(game.category.name)
        const minPriceCondition =
          minPriceNumber === null || game.price >= minPriceNumber
        const maxPriceCondition =
          maxPriceNumber === null || game.price <= maxPriceNumber

        return areaCondition && minPriceCondition && maxPriceCondition
      })
      return gamesFiltrados
    }

    const filters = transformQueryToObject()
    const filtersChanged = changedFilters(filters)

    const filteredGames = filterGames(
      allGames,
      filtersChanged,
      filters.minPrice,
      filters.maxPrice,
    )

    await prismaClient.$disconnect()
    return {
      status: 200,
      message: 'Jogos filtrados com sucesso',
      data: filteredGames,
    }
  }

  // ///////////////////////////////////////////////////////////////

  // public async update(data: any) {}

  // public async delete(data: any) {}
}
