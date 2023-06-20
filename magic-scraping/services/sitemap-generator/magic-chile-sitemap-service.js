const fs = require('fs');
const path = require('path');
const axios = require('axios');

class MagicChileSitemapService{
  constructor () {
    this.sitemapUrl = 'https://magic-chile.cl/sitemap.xml';
    this.headers = { 'Content-Type': 'application/xml',  'Accept': 'application/xml' };
    this.fileName = 'magic-chile-sitemap.xml';
    this.filePath = path.join( path.resolve(path.dirname(__dirname), '../tmp/sitemaps/'), this.fileName);
  }

  call = async () => {
    let response = await axios.get(this.sitemapUrl, { headers: this.headers });
    if (response.data){
      fs.writeFileSync(this.filePath, response.data, function (err) {
        if (err) throw err;
      });
    }
  }
}

module.exports = MagicChileSitemapService;