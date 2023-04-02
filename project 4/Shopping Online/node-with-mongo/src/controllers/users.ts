import { UserInterface } from '../interfaces/user'
import { User } from '../models/user'
import { Document, Types } from 'mongoose'

export const findUserById = async (
    usId: string
  ): Promise<Document<unknown, any, UserInterface>[]> => {
    return await User.find({ id: `${usId}`})
  }

  export const findUserByEmail = async (
    usEmail: string
  ): Promise<Document<unknown, any, UserInterface>[]> => {
    return await User.find({ email: `${usEmail}`})
  }

export const findUsers = async (
    ): Promise<Document<unknown, any, UserInterface>[]> => {
      return await User.find()
    }

    export const updateUser = async (
        id1: number,
        cartKey1: number
      ): Promise<Document<unknown, any, UserInterface> | null | any> => {
          const [user] = await User.find({ id: `${id1}` })
          console.log(user)
          if (!user) return null
          user.set({ id: id1, cartKey: cartKey1 });
          return await user.save()       
      }

      export const createUser = async (
        doc: UserInterface
      ): Promise<Document<unknown, any, UserInterface>> => {
        const user = new User(doc)
        return await user.save()
      }

