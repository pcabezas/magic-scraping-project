class ScrapingStrategy {
  constructor () {
    this.strategy = null;
  }

  set strategy (strategy) {
    this._strategy = strategy;
  }

  get strategy () {
    return this._strategy;
  }

  async scrape () {
    this.strategy.scrape();
  }
}

module.exports = ScrapingStrategy