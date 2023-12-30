import { GameService } from '../services/Game.service'

export async function validateGame(gameId: number) {
  const gameExists = await new GameService().readOne(gameId)

  if (gameExists.status === 404) {
    return {
      message: gameExists.message,
      status: gameExists.status,
      data: null,
    }
  }

  return null
}
