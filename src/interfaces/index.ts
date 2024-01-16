export interface IUser {
  email: string
  password: string
}

export interface IRegister extends IUser {
  name: string
  phone: string
}

export interface IUpdateUser {
  currentEmail: string
  currentPassword: string
  name?: string
  newEmail?: string
  newPassword?: string
  phone?: string
}

export interface IPayloadJWT {
  id: number
  email: string
  name: string
  phone: string
}

export interface IGame {
  id?: number
  name: string
  categoryId: number
  price: number
  image: string
  description: string
}

export interface IGameApi {
  id: number
  name: string
  category: {
    id: number
    name: string
    namePt: string
  }
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

export interface IQueryOrder {
  status?: string | null
}

export interface ICardData {
  cardNumber: string
  cardName: string
  cardDate: string
  cardCvv: string
  cardPortions: string
}

export interface ICategory {
  name: string
  namePt: string
}

export interface IEvaluation {
  description?: string
  stars: number
  productId: number
  userId: number
}

export interface IGameWithOrderInfo extends IGame {
  orderInfo: {
    id: number
    date: Date
  }
}
