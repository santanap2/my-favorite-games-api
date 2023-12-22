import { prismaClient } from '../../database/prismaClient'
import { IGame } from '../../interfaces'
import { createGameFieldsValidation } from '../validations/Game'

export class GameService {
  public async create(game: IGame) {
    const { name, genre, genrePt, price, image, description } = game

    const validation = createGameFieldsValidation(game)
    if (validation)
      return { status: validation.status, message: validation.message }

    const { data } = await this.readByName(name)
    if (data)
      return { status: 400, message: 'Jogo já adicionado no banco de dados' }

    const result = await prismaClient.game.create({
      data: { name, genre, genrePt, price, image, description },
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

    const invalidGamePromises = games.map(async (game, index) => {
      const validation = createGameFieldsValidation(game)

      if (validation !== null)
        return {
          status: validation.status,
          message: `${validation.message}. Jogo com erro: ${
            game.name || 'Nome ausente'
          }, posição: ${index + 1}`,
        }

      const { data } = await this.readByName(game.name)
      if (data)
        return {
          status: 400,
          message: `Jogo já adicionado no banco de dados. Jogo com erro: ${
            game.name
          }, posição: ${index + 1}`,
        }

      return null
    })

    const invalidGame = await Promise.all(invalidGamePromises)
    const firstInvalidGame = invalidGame.find((game) => game !== null)
    if (firstInvalidGame)
      return {
        status: firstInvalidGame.status,
        message: firstInvalidGame.message,
      }

    const result = await prismaClient.game.createMany({
      data: [...games],
    })

    if (!result)
      return {
        status: 500,
        message: 'Ocorreu um erro inesperado, por favor tente novamente',
      }

    await prismaClient.$disconnect()
    return {
      status: 201,
      message: 'Jogos adicionados com sucesso',
      data: result,
    }
  }

  // ///////////////////////////////////////////////////////////////

  public async read() {
    const result = await prismaClient.game.findMany()

    if (!result)
      return {
        status: 500,
        message: 'Ocorreu um erro inesperado, por favor tente novamente',
      }

    if (result.length === 0)
      return { status: 404, message: 'Sem jogos adicionados' }

    await prismaClient.$disconnect()
    return { status: 200, message: 'Jogos encontrados', data: result }
  }

  // ///////////////////////////////////////////////////////////////

  public async readOne(id: number) {
    if (isNaN(id)) return { status: 400, message: 'Insira um ID válido' }

    const result = await prismaClient.game.findUnique({ where: { id } })

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

  // public async update(data: any) {}

  // public async delete(data: any) {}
}
