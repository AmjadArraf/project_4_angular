import { Router, Request, Response } from 'express'
import {
    findUsers,
    createUser,
    findUserById,
    updateUser,
    findUserByEmail
  } from '../controllers/users'
  import { registerValidator, loginValidator } from '../middleware/formValidator'
  import matchedData from '../middleware/matchedData'
  import passwordValidator from '../middleware/passwordValidator'
  import passwordEncryptor from '../middleware/passwordEncryptor'
  import jwtSign from '../middleware/jwtSign'
  import { validationResult } from 'express-validator'
import userValidator from '../middleware/userValidator'
import jwtVerifyAdmin from '../middleware/jwtVerifyAdmin'
import jwtVerifyUser from '../middleware/jwtVerifyUser'

const router: Router = Router()

// get all users
router.get('/', [
    jwtVerifyAdmin
  ], async (req: Request, res: Response) => {
    try {
      const users = await findUsers()
      users.length ? res.send(users) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

// get user by id
router.get('/id/:num', async (req: Request, res: Response) => {
    try {
      const { num } = req.params
      const users = await findUserById(num)
      users.length ? res.send(users) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

// update user by cartKey, adds cart number to user profile
router.put('/', async (req: Request, res: Response) => {
    try {
      const { id, cartKey } = req.body
      const user = await updateUser(id, cartKey)
      user ? res.send(user) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

//   register user
  router.post('/add', [
    matchedData,
    ...registerValidator,
    passwordValidator,
    passwordEncryptor,
    jwtSign
  ], async (req: Request, res: Response) => {
    let userId = req.body.id
    let userEmail = req.body.email
    console.log(userEmail)
    try {
      try {
        const users = await findUsers()
        if(users.length){
          for(const user of users){
            const us: any = user
            if(+(us.id)==userId || userEmail==us.email){
                res.send({message: 'user Id or Email already exists'})
                return;
            }
            }
          }
      } catch (error) {
        console.error(error)
        res.sendStatus(500)}
        const newUser = {role: "user", cartKey: 0, ...req.body, password: res.locals.password}
      const user = await createUser(newUser)
      res.send({ accessToken: res.locals.accessToken, role: 'user' })
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

//   login user
  router.post(
    '/login',
    [
      matchedData,
      ...loginValidator,
      userValidator,
      jwtSign
    ],
    async (req: Request, res: Response) => {
      try {
        if (!validationResult(req).isEmpty()) {
          const errors = validationResult(req).array()
          return res.status(400).send({ errors })
        }
        res.send({ accessToken: res.locals.accessToken, role: res.locals.role })
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    }
  )

  // finds user by email
  router.get('/email/:email', async (req: Request, res: Response) => {
    try {
      const { email } = req.params
      const users = await findUserByEmail(email)
      users.length ? res.send(users) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

  router.post(
    '/verify',
    [
      jwtVerifyUser
    ],
    async (req: Request, res: Response) => {
      try {
        res.send({ response : "allowed" })
      } catch (error) {
        console.error(error)
        res.sendStatus(500)
      }
    }
  )
  
export default router