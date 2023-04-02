import { Router, Request, Response } from 'express'
import {
  createProduct,
  findProductByKey,
  findProductByCatKey,
  findProducts,
  deleteProduct,
  updateProduct
} from '../controllers/products'
import jwtVerifyAdmin from '../middleware/jwtVerifyAdmin'

const router: Router = Router()


// get by product key number
router.get('/key/:num', async (req: Request, res: Response) => {
  try {
    const { num } = req.params
    const account = await findProductByKey(num)
    account.length ? res.send(account) : res.sendStatus(404)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

// find products by categoty key
router.get('/catKey/:num', async (req: Request, res: Response) => {
  try {
    const { num } = req.params
    const account = await findProductByCatKey(num)
    account.length ? res.send(account) : res.sendStatus(404)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

// get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await findProducts()
    products.length ? res.send(products) : res.sendStatus(404)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

// delete product by key number
router.delete('/byKey/:tag', [
  jwtVerifyAdmin
], async (req: Request, res: Response) => {
  try {
    const count = await deleteProduct(req.params.tag)
    count ? res.send(`product deleted`) : res.sendStatus(404)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

// add product by admin, the key generated for the product will be larger than the highest key number of the existing
// products in order for the keys to be unique for each product.
router.post('/add', [
  jwtVerifyAdmin
], async (req: Request, res: Response) => {
  let keynum = 0;
  try {
    try {
      const products = await findProducts()
      if(products.length){
        for(const product of products){
          const pro: any = product
          if(+(pro.key)>=keynum){
          keynum = +(pro.key) + 1
          }
          }
        }
    } catch (error) {
      console.error(error)
      res.sendStatus(500)}
    const userquery = { key: keynum, ...req.body };
    const product = await createProduct(userquery)
    res.send(product)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})

// update product by product key
router.put('/', [
  jwtVerifyAdmin
], async (req: Request, res: Response) => {
  try {
    const { key, name, catKey, price, img } = req.body
    const product = await updateProduct(key, name, catKey, price, img)
    product ? res.send(product) : res.sendStatus(404)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
})


export default router

