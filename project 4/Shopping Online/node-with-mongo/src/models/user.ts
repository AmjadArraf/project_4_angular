import { Schema, model } from 'mongoose'
import { UserInterface } from '../interfaces/user';

const userSchema = new Schema<UserInterface>({
    firstName: String,
    familyName: String,
    email: String,
    id: Number,
    password: String,
    city: String,
    street: String,
    role: String,
    cartKey: Number,
})

export const User = model<UserInterface>('user', userSchema)