import * as uuid from 'uuid'

import { Categorie } from '../models/Categorie'
import { CategoriesAccess } from '../dataLayer/categoriesAccess'
import { CreateCategorieRequest } from '../requests/CreateCategorieRequest'
import { getUserId } from '../auth/utils'

const categorieAccess = new CategoriesAccess()

export async function getAllCategories(): Promise<Categorie[]> {
  return categorieAccess.getAllCategories()
}

export async function createCategorie(
    createCategoriesRequest: CreateCategorieRequest,
  jwtToken: string
): Promise<Categorie> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)
  return await categorieAccess.createCategorie({
    id: itemId,
    userId: userId,
    name: createCategoriesRequest.name,
    description: createCategoriesRequest.description
  })
}
