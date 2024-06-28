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
      return {
        status: 400,
        message: 'Categoria já adicionada no banco de dados',
      }

    const result = await prismaClient.category.create({
      data: {
        name,
        namePt,
      },
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

  // ///////////////////////////////////////////////////////////////

  public async createMany(categories: ICategory[]) {
    if (!Array.isArray(categories))
      return { status: 400, message: 'Por favor insira um array de categorias' }

    const result = await prismaClient.category.createMany({
      data: [...categories],
      skipDuplicates: true,
    })

    const allCategories = await this.readAll()

    await prismaClient.$disconnect()
    return {
      status: 201,
      message: `Categorias criadas: ${result.count}`,
      data: allCategories.data,
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

  public async readAll() {
    const result = await prismaClient.category.findMany()

    if (result)
      return {
        status: result.length === 0 ? 404 : 200,
        message:
          result.length === 0
            ? 'Sem categorias adicionadas'
            : 'Categorias encontradas com sucesso',
        data: result,
      }

    return {
      status: 500,
      message: 'Ocorreu um erro inesperado, tente novamente',
      data: null,
    }
  }

  //   public async update(data: any) {}

  //   public async delete(data: any) {}
}
