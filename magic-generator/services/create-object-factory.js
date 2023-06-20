const CreateProductService = require('./create-product-service');

class createObjetFactory {

  create(taskName, data){
    switch (taskName) {
      case 'product.create':
        return new CreateProductService(taskName, data);
      default:
        return null;
    }
  }
}

module.exports = createObjetFactory;