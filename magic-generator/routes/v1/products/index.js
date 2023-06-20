const express = require('express');
const router = express.Router();
const { checkSchema } = require('express-validator');
const { postProduct } = require('../../../controllers/v1/products/index');
const modelValidator = require('../../../middlewares/models-validator');

const createProductValidation = () => {
  return checkSchema({
    name: {
      isLength: {
        options: { min: 1 },
      },
      custom: {
        options: (value, {req, location, path}) => {
          if (value == 'sobres') throw new Error('Valor custom');
          return value
        }
      }
    },
    url: {
      isLength: {
        options: { min: 15 },
      }
    },
    image: {
      isLength: {
        options: { min: 10 },
      }
    },
    price: {
      isInt: { min: 1, max: 10000000 },
      errorMessage: 'price must be between 1 and 10000000'
    }
  })
}

// Products Routes
router.post('/product', createProductValidation(), modelValidator, postProduct);

module.exports = router;