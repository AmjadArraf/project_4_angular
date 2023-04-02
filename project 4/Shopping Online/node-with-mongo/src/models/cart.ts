import { Schema, model } from 'mongoose'
import { CartInterface, CartProduct } from '../interfaces/cart';

const cartSchema = new Schema<CartInterface>({
    key: Number,
    date: Date,
    products: [{ 
        proKey: Number,
        amount: Number
      }]
})

export const Cart = model<CartInterface>('cart', cartSchema)