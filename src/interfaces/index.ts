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

export interface IGame {
  name: string
  genre: string
  genrePt: string
  price: number
  image: string
  description: string
}

export interface IFilters {
  actionAdventure?: boolean
  rpgOpenWorld?: boolean
  racing?: boolean
  rpgTurnBased?: boolean
  actionTerror?: boolean
  fps?: boolean
  survivalHorror?: boolean
  actionRhythm?: boolean
  minPrice?: string
  maxPrice?: string
}

export interface IQueryObject {
  busca?: string | null
  actionAdventure?: string
  rpgOpenWorld?: string
  racing?: string
  rpgTurnBased?: string
  actionTerror?: string
  fps?: string
  survivalHorror?: string
  actionRhythm?: string
  minPrice?: string | null
  maxPrice?: string | null
}
