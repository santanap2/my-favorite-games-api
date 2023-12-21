export interface IUser {
  email: string
  password: string
}

export interface IRegister extends IUser {
  name: string
  phone: string
}

export interface IPayloadJWT {
  id: number
  email: string
  name: string
  phone: string
}
