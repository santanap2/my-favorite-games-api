import { parseCookie } from '../../helpers/parse'
import { verifyToken } from '../../utils/jwt'
import { UserService } from '../services/User.service'

export const isAuthenticatedValidation = async (cookie?: string) => {
  if (!cookie || cookie === '')
    return {
      status: 401,
      message: 'Usuário não autenticado',
      data: null,
    }

  const parsedCookie = parseCookie(cookie)
  const payload = verifyToken(parsedCookie?.gamingPlatformAuth || '')

  if (!payload)
    return {
      status: 404,
      message: 'Usuário não encontrado',
      data: null,
    }

  const { data } = await new UserService().readOne(payload.id)

  return {
    status: 200,
    message: 'Usuário encontrado com sucesso',
    data,
  }
}
