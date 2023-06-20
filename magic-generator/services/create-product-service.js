const Product = require('../models/product');
const CreateObjectService = require('./create-object-service');

class CreateProductService extends CreateObjectService {
  constructor(taskName, data){
    super(taskName, data);
  }

  create (){
    const product = new Product(this.defineObjToMongo());
    product.validate()
    .then(()=>{
      product.save();
    }).catch((error) => {
      console.log('Inside the error')
      console.log(error)
    })
  }

  defineObjToMongo (){
    return {
            name: this.data?.name,
            description: this.data?.description,
            brand: this.data?.brand,
            siteUrl: this.data?.url,
            sitePrice: this.cleanPrice(this.data?.price),
            siteImage: this.data?.image
           }
  }

  cleanPrice (price){
    try {
      return parseInt(price.replace(/\D/g,''))
    } catch (error) {
      console.log(`Error parsing price ${price} . ${error}`);
      return 0
    }
  }
}

module.exports = CreateProductService;