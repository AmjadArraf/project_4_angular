import express, { Application, Request, Response } from 'express'
import mongoose, { connect } from 'mongoose'
import 'dotenv/config'
import products from './routes/products'
import users from './routes/users'
import carts from './routes/carts'
import categories from './routes/categories'

const mongoUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`

console.log('Trying to connect to mongodb')

mongoose.set('strictQuery', false)
connect(mongoUrl)
  .then(() => console.log('Successfully connected to mongodb'))
  .catch((error) => {
    console.error(error)
  })

const app: Application = express()

app.use(express.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/products', products)
app.use('/users', users)
app.use('/carts', carts)
app.use('/categories', categories)

app.use((req: Request, res: Response) => {
  res.sendStatus(404).send(`Endpoint not supported ${req.url}`)
})

app.listen(process.env.APP_PORT, () => {
  console.log(`Server is listening on port ${process.env.APP_PORT}`)
})