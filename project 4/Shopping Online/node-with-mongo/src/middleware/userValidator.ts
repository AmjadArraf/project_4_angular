import { compare } from 'bcryptjs'
import { Request, Response, NextFunction } from 'express'
import { findUserByEmail } from '../controllers/users'


export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body
    const users = await findUserByEmail(email)
    if(!users.length){
      res.send('user does not exist')
      return;
    }
    
    const specificUser: any = users[0]
    const specificpassword = specificUser.password
    const specificRole = specificUser.role
    res.locals.role = specificRole

    const isValidPwd = await compare(
        req.body.password,
        specificpassword
      )
      console.log(isValidPwd)
      if (!isValidPwd) {
        return res.sendStatus(401)
      }
      next()
    }
    
    catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}






