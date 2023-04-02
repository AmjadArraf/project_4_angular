import { Request, Response, NextFunction } from 'express'
import jwt, { VerifyErrors } from 'jsonwebtoken'
import { findUserByEmail } from '../controllers/users'


export default async (req: Request, res: Response, next: NextFunction) => {
  try {

    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.sendStatus(401)
    }
    const token = authHeader.split(' ')[1]
    if (!token) {
      return res.sendStatus(401)
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
      return res.sendStatus(500)
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          return res.status(403).send({errors: ['You do not have permission']})
        }
        const { email } = decoded

        const users = await findUserByEmail(email)
        if(!users.length){
        res.send('user does not exist')
        return;
        }
    
        const specificUser: any = users[0]
        const role = specificUser.role

        if (!(role=="user")) {
            return res.status(403).send({errors: ['You do not have permission']})
        }

        next()
      }
    )
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
}
