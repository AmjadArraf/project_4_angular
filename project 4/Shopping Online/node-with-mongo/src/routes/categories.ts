import { Router, Request, Response } from 'express'
import {
  findCategories
} from '../controllers/categories'


const router: Router = Router()

// gets the categories of the products
router.get('/', async (req: Request, res: Response) => {
    try {
      const categories = await findCategories()
      categories.length ? res.send(categories) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })


  export default router