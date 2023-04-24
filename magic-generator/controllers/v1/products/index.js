const Product = require('../../../models/product');

const postProduct = async (req, res) => {
  try {
    const body = req.body;
    const product = new Product(body);
    await product.save();
    res.status(200).json(product);
  } catch (error) {
    console.log(error)
    res.status(400).json({});
  }
}

module.exports = {
  postProduct
}