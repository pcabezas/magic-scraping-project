const Scraping = require('./models/scraping-strategy');
const Strategy = require('./models/magic-chile-strategy');

const main  = async () => {
  const scrape = new Scraping();
  const strategy = new Strategy();
  scrape.strategy = strategy;
  scrape.scrape();
}

main();