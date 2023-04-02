import { Schema, model } from 'mongoose'
import { CategoryInterface } from '../interfaces/category';

const categorySchema = new Schema<CategoryInterface>({
    key: Number,
    name: String
})

export const Category = model<CategoryInterface>('category', categorySchema)