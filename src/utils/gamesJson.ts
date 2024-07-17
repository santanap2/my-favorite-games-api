import { IGame } from '../interfaces'
import * as fs from 'fs'
import * as path from 'path'

export const imagePath = path.join(process.cwd(), 'public/games/images')

export const getGameImages = (directoryPath: string): string[] => {
  try {
    return fs.readdirSync(directoryPath).filter((file) => file.endsWith('.jpg'))
  } catch (err) {
    console.error('Erro ao ler o diretório de imagens:', err)
    return []
  }
}

export const formatString = (str: string): string => {
  return str
    .replace(/[:_\-']/g, ' ')
    .replace(/\s+/g, ' ')
    .replace("'", '')
    .trim()
    .toLowerCase()
}

export const updateGamesWithImages = (
  games: IGame[],
  imageDirectory: string,
) => {
  const images = getGameImages(imageDirectory)

  return games.map((game, index) => {
    const formattedGameName = formatString(game.name)

    const imageFileName = images.find((image) => {
      const formattedImageFileName = formatString(image.replace('.jpg', ''))
      return formattedImageFileName === formattedGameName
    })

    if (imageFileName) {
      return {
        ...game,
        image: `{{API_URL}}/games/images/${imageFileName}`,
        index,
      }
    }
    return game
  })
}

// updateGamesWithImages(games, imagePath)
