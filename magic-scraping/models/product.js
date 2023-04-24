class Product {
  constructor(name = null, brand=null, stock=null, description=null, url = null, image = null, price = null){
    this.name = name;
    this.url = url;
    this.image = image;
    this.price = price;
    this.brand = brand;
    this.stock = stock;
    this.description = description;
  }
}

module.exports = Product;