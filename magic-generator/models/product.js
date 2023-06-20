const { Schema, model } = require('mongoose');

const ProductSchema = Schema({
  name: {
    type: String,
    required: [true, 'name can\'t be null '],
  },
  description: {
    type: String
  },
  brand: {
    type: String
  },
  url: {
    type: String,
    required: [true, 'url can\'t be null '],
  },
  price: {
    type: Number,
    required: [true, 'price can\'t be null']
  },
  image: {
    type: String,
    required: [true, 'image can\'t be null']
  }
});

module.exports = model('Product', ProductSchema);