import { ProductInterface } from '../interfaces/product'
import { Product} from '../models/product'
import { Document, Types } from 'mongoose'

// add product by admin
export const createProduct = async (
  doc: ProductInterface
): Promise<Document<unknown, any, ProductInterface>> => {
  const product = new Product(doc)
  return await product.save()
}

// read/find

// export const findCourses = async (filter: {
//   isOnline?: string
//   startDate?: Date
// }): Promise<Document<unknown, any, Icourse>[]> => {
//   const { isOnline, startDate } = filter
//   console.log(new Date(startDate as Date))
//   switch (true) {
//     case isOnline !== undefined && startDate !== undefined:
//       return await Course.find({
//         isOnline: isOnline === 'true',
//         startDate: {
//           $lte: new Date(startDate as Date),
//         },
//       })
//     case isOnline !== undefined:
//       return await Course.find({
//         isOnline: isOnline === 'true',
//       })
//     case startDate !== undefined:
//       return await Course.find({
//         startDate: {
//           $lte: new Date(startDate as Date),
//         },
//       })
//     default:
//       return await Course.find()
//   }
// }

// export const findCoursesWithLimitSortSelect = async (
//   limit: number,
//   sortBy: string,
//   keys: string[],
//   desc: boolean
// ): Promise<Document<unknown, any, Icourse>[]> => {
//   const select: any = {}
//   for (const key of keys) {
//     select[key] = 1
//   }
//   return await Course.find()
//     .limit(limit)
//     .sort({ [sortBy]: desc ? -1 : 1 })
//     .select(select)
//   // keys = ["name", "price"]
//   // select = {
//   //     "name": 1
//   //     "price" : 1
//   // }
// }


export const findProductByKey = async (
  Pronum: string
): Promise<Document<unknown, any, ProductInterface>[]> => {
  return await Product.find({ key: `${Pronum}`})
}

export const findProductByCatKey = async (
  Pronum: string
): Promise<Document<unknown, any, ProductInterface>[]> => {
  return await Product.find({ catKey: `${Pronum}`})
}

export const findProducts = async (
): Promise<Document<unknown, any, ProductInterface>[]> => {
  return await Product.find()
}

export const deleteProduct = async (prokey: string): Promise<number> => {
  const { deletedCount } = await Product.deleteMany({ key: prokey })
  return deletedCount 
}

export const updateProduct = async (
  key1: number,
  name1: string,
  catKey1: number,
  price1: number,
  img1: string
): Promise<Document<unknown, any, ProductInterface> | null | any> => {
  
    const [product] = await Product.find({ key: `${key1}` })
    console.log(product)
    if (!product) return null
    product.set({ key: key1, name: name1, catKey: catKey1, price: price1 , img : img1 });
    return await product.save() 
}