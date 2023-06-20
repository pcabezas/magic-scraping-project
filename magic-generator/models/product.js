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
  siteUrl: {
    type: String,
    required: [true, 'siteUrl can\'t be null '],
  },
  sitePrice: {
    type: Number,
    required: [true, 'price can\'t be null']
  },
  siteImage: {
    type: String,
    required: [true, 'siteImage can\'t be null']
  }
});

module.exports = model('Product', ProductSchema);