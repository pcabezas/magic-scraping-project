class MagicChileFilterUrlsService{
  constructor (urls) {
    this.urls = urls;
    this.targets = ['mtg-', '-magic-'];
  }

  call = async () => {
    return this.urls.filter(sitemapUrl => {
      let { loc: [url] } = sitemapUrl;
      return this.checkUrlIncludeAnyTarget(url);
    }).map(sitemapUrl => {
      let { loc: [url] } = sitemapUrl;
      return url
    });
  }

  checkUrlIncludeAnyTarget (url) {
    let result = false;
    for(const target of this.targets){
      result = url.includes(target) ? true : false;
      if(result) break;
    }
    return result
  }
}

module.exports = MagicChileFilterUrlsService;