import { prismaClient } from '../../database/prismaClient'
import { ICategory } from '../../interfaces'
import { createCategoryFieldsValidation } from '../validations/Category'

export class CategoryService {
  public async create({ name, namePt }: ICategory) {
    const validation = createCategoryFieldsValidation({ name, namePt })
    if (validation)
      return { status: validation.status, message: validation.message }

    const { data } = await this.readByName({ name, namePt })
    if (data)
      return { status: 400, message: 'Jogo já adicionado no banco de dados' }

    const result = prismaClient.category.create({
      data: {
        name,
        namePt,
      },
      include: { products: true },
    })

    if (!result)
      return {
        status: 500,
        message: 'Ocorreu um erro inesperado, por favor tente novamente',
      }

    await prismaClient.$disconnect()
    return {
      status: 201,
      message: 'Categoria criada com sucesso',
      data: result,
    }
  }

  public async createMany(categories: ICategory[]) {
    const result = prismaClient.category.createMany({
      data: categories,
    })

    await prismaClient.$disconnect()
    return {
      status: 201,
      message: 'Categorias criadas com sucesso',
      data: result,
    }
  }

  public async readByName({ name, namePt }: ICategory) {
    if (!name || !namePt)
      return { status: 400, message: 'Insira um nome válido' }

    const result = await prismaClient.category.findUnique({
      where: { name, namePt },
    })

    if (!result)
      return {
        status: 404,
        message: 'Jogo não encontrado',
        data: null,
      }

    await prismaClient.$disconnect()
    return { status: 200, message: 'Jogo encontrado', data: result }
  }
  //
  //   public async update(data: any) {}
  //
  //   public async delete(data: any) {}
}
