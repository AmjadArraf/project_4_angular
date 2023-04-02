import { CartInterface } from '../interfaces/cart'
import { Cart } from '../models/cart'
import { Document, Types } from 'mongoose'

export const findCarts = async (
    ): Promise<Document<unknown, any, CartInterface>[]> => {
      return await Cart.find()
    }

export const findCartByKey = async (
    Pronum: string
  ): Promise<Document<unknown, any, CartInterface>[]> => {
    return await Cart.find({ key: `${Pronum}`})
  }

  export const updateCart = async (
    key1: number,
    products1: any
  ): Promise<Document<unknown, any, CartInterface> | null | any> => {
    
      const [cart] = await Cart.find({ key: `${key1}` })
      console.log(cart)
      if (!cart) return null
      cart.set({ key: key1, products: products1 });
      return await cart.save() 
  }

  export const deleteCart = async (prokey: string): Promise<number> => {
    const { deletedCount } = await Cart.deleteMany({ key: prokey })
    return deletedCount 
  }

  export const createCart = async (
    doc: CartInterface
  ): Promise<Document<unknown, any, CartInterface>> => {
    const cart = new Cart(doc)
    return await cart.save()
  }

// add, update or delete cart item, if amount is 0 the item will be deleted
export const addOrUpdateCartItem = async (
    key1: number,
    prokey1: number,
    amount1: number
  ): Promise<Document<unknown, any, CartInterface> | null | any> => {
    
      const [cart] = await Cart.find({ key: `${key1}` })
      if (!cart) return null
      let prodArr = []
      for(const product of cart.products) {
        const pr: any = product
        if(pr.proKey!==prokey1){
            prodArr.push(product)
        }
      }
      if(amount1){
      prodArr.push({proKey: prokey1, amount: amount1})
      }

      cart.set({ key: key1, products: prodArr });
      return await cart.save() 
  }