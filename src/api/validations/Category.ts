import { ICategory } from '../../interfaces'

export const createCategoryFieldsValidation = ({ name, namePt }: ICategory) => {
  if (!name || name === '')
    return { status: 400, message: 'Por favor insira o nome da categoria' }

  if (!namePt || namePt === '')
    return {
      status: 400,
      message: 'Por favor insira o nome em português da categoria',
    }

  return null
}
