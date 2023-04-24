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
    siteUrl: {
      isLength: {
        options: { min: 15 },
      }
    },
    siteImage: {
      isLength: {
        options: { min: 10 },
      }
    },
    sitePrice: {
      isInt: { min: 1, max: 10000000 },
      errorMessage: 'sitePrice must be between 1 and 10000000'
    }
  })
}

// Products Routes
router.post('/product', createProductValidation(), modelValidator, postProduct);

module.exports = router;