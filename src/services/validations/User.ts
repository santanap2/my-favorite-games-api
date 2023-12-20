export const userFieldsValidations = (
  email: string,
  name: string,
  password: string,
  phone: string,
) => {
  if (!email) return { status: 400, message: 'Please provide your email.' }

  if (!password)
    return { status: 400, message: 'Please provide your password.' }

  if (!name) return { status: 400, message: 'Please provide your name.' }

  if (!phone) return { status: 400, message: 'Please provide your phone.' }

  return null
}
