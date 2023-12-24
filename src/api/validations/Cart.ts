import { GameService } from '../services/Game.service'
import { UserService } from '../services/User.service'

export async function validateUserAndGame(userId: number, gameId: number) {
  const userExists = await new UserService().readOne(userId)
  const gameExists = await new GameService().readOne(gameId)

  if (userExists.status === 404) {
    return {
      message: userExists.message,
      status: userExists.status,
    }
  }

  if (gameExists.status === 404) {
    return {
      message: gameExists.message,
      status: gameExists.status,
      data: null,
    }
  }

  return null
}
