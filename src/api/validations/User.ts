export const createUserFieldsValidation = (
  email: string,
  name: string,
  password: string,
  phone: string,
) => {
  if (!email) return { status: 400, message: 'Por favor insira seu email' }

  if (!password) return { status: 400, message: 'Por favor insira sua senha' }

  if (!name) return { status: 400, message: 'Por favor insira seu nome' }

  if (!phone) return { status: 400, message: 'Por favor insira seu telefone' }

  return null
}

export const updateUserFieldsValidation = (
  name: string,
  currentEmail: string,
  newEmail: string,
  currentPassword: string,
  newPassword: string,
  phone: string,
) => {
  if (!name) return { status: 400, message: 'Por favor insira seu nome' }

  if (!currentEmail)
    return { status: 400, message: 'Por favor insira seu email atual' }

  if (!newEmail)
    return { status: 400, message: 'Por favor insira seu novo email' }

  if (!phone) return { status: 400, message: 'Por favor insira seu telefone' }

  if (!currentPassword)
    return { status: 400, message: 'Por favor insira sua senha atual' }

  if (!newPassword)
    return { status: 400, message: 'Por favor insira sua nova senha' }

  return null
}
