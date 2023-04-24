const puppeteer = require('puppeteer');
const Product = require('./product');
const RabbitMqConnector = require('../config/rabbitmq');

class MagicChileStrategy {
  constructor(){
    this.pageName = 'https://magic-chile.cl';
    this.ladingPagePath = '/tcg/magic';
  }

  fullLandingPageUrl () {
    return `${this.pageName}${this.ladingPagePath}`
  }

  async startBrowser () {
    let browser;
    try {
      console.log("Opening the browser......");
      browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox"],
        'ignoreHTTPSErrors': true
      });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
    }
    return browser;
  }

  async scrape () {
    const browser = await this.startBrowser();
    const productUrls = await this.getProductsPageUrl(browser);
    const productsData = await this.getProductData(browser, productUrls);
    browser.close();
    this.createProducts(productsData);
  }

  async getProductsPageUrl (browser) {
    console.log(`Navigating to ${ this.fullLandingPageUrl() } `);
    let page = await browser.newPage();
    await page.goto(this.fullLandingPageUrl());
    await page.waitForSelector('.product-block');
    let urls = await page.$$eval('.product-block', productBox => {
      links = productBox.map(box => { return box.querySelector('a.product-image').href });
      return links;
    });
    page.close();
    return urls
  }

  async getProductData (browser, productUrls){
    const data = await Promise.all(productUrls.map(async (url) => {
      let page = await browser.newPage();
      await page.goto(url);
      let productData = await page.$$eval('.product-page', pageInfo => {
        pageInfo = pageInfo[0];
        boxInfo = pageInfo.querySelector('#product-form');
        imagesSelector = pageInfo.querySelector('.main-product-image img');
        data = {}
        productTargets = [
          { key: 'name', target: 'h1.page-header' },
          { key: 'brand', target: 'div.brand' },
          { key: 'stock', target: '#stock > .product-form-stock' },
          { key: 'description', target: '.description' },
          { key: 'price', target: '#product-form-price' }
        ]
        productTargets.forEach(target => {
          selector = boxInfo.querySelector(target.target);
          data[target.key] = selector ? selector.textContent : null;
        })
        data.image = imagesSelector ? imagesSelector.src : null;
        return data
      });
      //page.close();
      console.log(productData);
      return new Product(productData.name,
                         productData.brand,
                         productData.stock,
                         productData.description,
                         url,
                         productData.image,
                         productData.price);
    }));
    return data;
  }

  async createProducts (products){
    const rabbitManager = new RabbitMqConnector();
    await rabbitManager.init();

    for (const product of products) {
      const message = Buffer.from(JSON.stringify(product));
      await rabbitManager.setNewTask('product.create', message);
    }

    rabbitManager.closeConnection();
  }
}

module.exports = MagicChileStrategy