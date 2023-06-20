const puppeteer = require('puppeteer');
const fs = require('fs');
const xml2js = require('xml2js');

const Product = require('./product');
const MagicChileFilterUrlsService = require('../services/magic-chile-filter-urls-service');
const MagicChileSitemapService = require('../services/sitemap-generator/magic-chile-sitemap-service');
const RabbitMqConnector = require('../config/rabbitmq');

class MagicChileStrategy {
  constructor(){
    this.pageName = 'https://magic-chile.cl';
    this.ladingPagePath = '/tcg/magic';
    this.sitemapService = new MagicChileSitemapService();
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
    // Get page sitemap.xml
    await this.sitemapService.call();
    // cleaned products urls
    const productUrls = await this.getProductsPageUrl();
    const browser = await this.startBrowser();
    const productsData = await this.getProductData(browser, productUrls);
    this.createProducts(productsData);
    browser.close();
  }

  async getProductsPageUrl () {
    const parser = new xml2js.Parser();
    const data = fs.readFileSync(this.sitemapService.filePath, {encoding: 'utf8'});
    const { urlset: { url } } = await parser.parseStringPromise(data)
    return this.filterUrls(url);
  }

  filterUrls (urls) {
    const serviceFilter = new MagicChileFilterUrlsService(urls);
    return serviceFilter.call();
  }

  // Version Scraping Page
  /*
  async getProductsPageUrl (browser) {
    console.log(`Navigating to ${ this.fullLandingPageUrl() } `);
    let page = await browser.newPage();
    await page.goto(this.fullLandingPageUrl());
    await page.waitForSelector('.product-block');
    let urls = await page.$$eval('.product-block', productBox => {
      return productBox.map(box => { return box.querySelector('a.product-image').href });
    });
    await page.waitForSelector('a.square-button');
    await page.click('a.square-button');
    page.close();
    return urls
  }
  */

  async getProductData (browser, productUrls){
    const data = await Promise.all(productUrls.map(async (url) => {
      let page = await browser.newPage();
      await page.goto(url);
      let productData = await page.$$eval('.product-page', pageInfo => {
        pageInfo = pageInfo[0];
        let boxInfo = pageInfo.querySelector('#product-form');
        let imagesSelector = pageInfo.querySelector('.main-product-image img');
        let data = {}
        let productTargets = [
          { key: 'name', target: 'h1.page-header' },
          { key: 'brand', target: 'div.brand' },
          { key: 'stock', target: '#stock > .product-form-stock' },
          { key: 'description', target: '.description' },
          { key: 'price', target: '#product-form-price' }
        ]
        productTargets.forEach(target => {
          let selector = boxInfo.querySelector(target.target);
          data[target.key] = selector ? selector.textContent : null;
        })
        data.image = imagesSelector ? imagesSelector.src : null;
        return data
      });
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