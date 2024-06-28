import { parseCookie } from '../../helpers/parse'
import { verifyToken } from '../../utils/jwt'
import { UserService } from '../services/User.service'

export const isAuthenticatedValidation = async (cookie?: string) => {
  if (!cookie || cookie === '')
    return {
      status: 400,
      message: 'Ocorreu um erro de autenticação, tente novamente',
      data: null,
    }

  const parsedCookie = parseCookie(cookie)

  if (!parsedCookie)
    return {
      status: 400,
      message: 'Ocorreu um erro de autenticação, tente novamente',
      data: null,
    }

  const payload = verifyToken(parsedCookie['authjs.session-token'])

  if (!payload)
    return {
      status: 404,
      message: 'Usuário não encontrado',
      data: null,
    }

  const { data } = await new UserService().readOne(payload.id)

  if (data)
    return {
      status: 200,
      message: 'Usuário encontrado com sucesso',
      data,
    }

  return {
    status: 500,
    message: 'Ocorreu um erro inesperado, tente novamente',
    data: null,
  }
}
