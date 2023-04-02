import { CategoryInterface } from '../interfaces/category'
import { Category} from '../models/category'
import { Document, Types } from 'mongoose'

export const findCategories = async (
    ): Promise<Document<unknown, any, CategoryInterface>[]> => {
      return await Category.find()
    }