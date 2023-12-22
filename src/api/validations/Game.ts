import { IGame } from '../../interfaces'

export const createGameFieldsValidation = ({
  name,
  genre,
  genrePt,
  price,
  image,
  description,
}: IGame) => {
  if (!name || name === '')
    return { status: 400, message: 'Por favor insira o nome do jogo' }

  if (!genre || genre === '')
    return { status: 400, message: 'Por favor insira o gênero do jogo' }

  if (!genrePt || genrePt === '')
    return { status: 400, message: 'Por favor insira o gênero do jogo' }

  if (!price)
    return { status: 400, message: 'Por favor insira o preço do jogo' }

  if (!image || image === '')
    return { status: 400, message: 'Por favor insira a capa do jogo' }

  if (!description || description === '')
    return { status: 400, message: 'Por favor insira a descrição do jogo' }

  return null
}
