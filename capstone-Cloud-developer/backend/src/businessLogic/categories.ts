import * as uuid from 'uuid'

import { Categorie } from '../models/Categorie'
import { CategoriesAccess } from '../dataLayer/categoriesAccess'
import { CreateCategoriesRequest } from '../requests/CreateCategoriesRequest'
import { getUserId } from '../auth/utils'

const categorieAccess = new CategoriesAccess()

export async function getAllCategories(): Promise<Categorie[]> {
  return categorieAccess.getAllCategories()
}

export async function createCategorie(
    createCategoriesRequest: CreateCategoriesRequest,
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
