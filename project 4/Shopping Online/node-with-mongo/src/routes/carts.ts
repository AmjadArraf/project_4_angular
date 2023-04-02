import { Router, Request, Response } from 'express'
import {
    findCarts,
  findCartByKey,
  updateCart,
  deleteCart,
  createCart,
  addOrUpdateCartItem
} from '../controllers/carts'
import jwtVerifyUser from '../middleware/jwtVerifyUser'

const router: Router = Router()

// get all carts
router.get('/', async (req: Request, res: Response) => {
    try {
      const carts = await findCarts()
      carts.length ? res.send(carts) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

// get cart by key
  router.get('/key/:num', [
    // jwtVerifyUser
  ], async (req: Request, res: Response) => {
    try {
      const { num } = req.params
      const cart = await findCartByKey(num)
      cart.length ? res.send(cart) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

// update cart by key
  router.put('/', [
    jwtVerifyUser
  ], async (req: Request, res: Response) => {
    try {
      const { key, products } = req.body
      const cart = await updateCart(key, products)
      cart ? res.send(cart) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

// delete cart by key 
  router.delete('/byKey/:tag', [
    jwtVerifyUser
  ], async (req: Request, res: Response) => {
    try {
      const count = await deleteCart(req.params.tag)
      count ? res.send(`cart cleared`) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

//   create cart
  router.post('/add', [
    // jwtVerifyUser
  ], async (req: Request, res: Response) => {
    let keynum = 0;
    try {
      try {
        const carts = await findCarts()
        if(carts.length){
          for(const cart of carts){
            const ca: any = cart
            if(+(ca.key)>=keynum){
            keynum = +(ca.key) + 1
            }
            }
          }
      } catch (error) {
        console.error(error)
        res.sendStatus(500)}
        
      const currentDate = new Date(Date.now());
      const userquery = { key: keynum, date: currentDate, ...req.body };
      const product = await createCart(userquery)
      res.send(product)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

//   add, update or delete cart item, if the amount is 0 the item will be deleted
  router.put('/item', [
    // jwtVerifyUser
  ], async (req: Request, res: Response) => {
    try {
      const { key, proKey, amount } = req.body
      const cart = await addOrUpdateCartItem(key, proKey, amount)
      cart ? res.send(cart) : res.sendStatus(404)
    } catch (error) {
      console.error(error)
      res.sendStatus(500)
    }
  })

  export default router