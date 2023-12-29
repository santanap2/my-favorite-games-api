import * as jwt from 'jsonwebtoken'
import { IPayloadJWT } from '../interfaces'
import * as dotenv from 'dotenv'

dotenv.config()
const secretKey = process.env.SECRET_KEY ?? ''

export const generateToken = async (payload: IPayloadJWT) => {
  const jwtConfig: jwt.SignOptions = {
    expiresIn: '7d',
    algorithm: 'HS256',
  }

  const token = jwt.sign(payload, secretKey, jwtConfig)
  return token
}

export const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey)
    return decoded
  } catch (error) {
    console.error(error)
    return error
  }
}
