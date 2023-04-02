import { Schema, model } from 'mongoose'
import { ProductInterface } from '../interfaces/product';

const productSchema = new Schema<ProductInterface>({
    key: Number,
    name: String,
    catKey:Number,
    price: Number,
    img: String
})

export const Product = model<ProductInterface>('product', productSchema)

