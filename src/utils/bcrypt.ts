import bcrypt from 'bcrypt'

const saltRounds = 12

export const hashPassword = async (password: string): Promise<string> => {
  const result = await bcrypt.hash(password, saltRounds)
  return result
}

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => {
  const result = await bcrypt.compare(password, hashedPassword)
  return result
}
