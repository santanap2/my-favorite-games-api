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
  currentEmail: string,
  currentPassword: string,
) => {
  if (!currentEmail)
    return { status: 400, message: 'Por favor insira seu email atual' }

  if (!currentPassword)
    return { status: 400, message: 'Por favor insira sua senha atual' }

  return null
}
