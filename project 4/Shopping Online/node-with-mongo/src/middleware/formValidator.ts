import { body, ValidationChain } from 'express-validator'

const validator: ValidationChain[] = [
  body('email').isEmail().withMessage('Invalid email'),
]

const registerValidator = [
  ...validator,
  body('firstName').notEmpty().withMessage('First Name is required'),
  body('familyName').notEmpty().withMessage('Family Name is required'),
  body('id').notEmpty().withMessage('Id is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('street').notEmpty().withMessage('Street is required'),
]

export { registerValidator, validator as loginValidator }
