const getPageSitemap = (pageName) => {
  return new Promise( (resolve, reject) => {
    switch (pageName) {
      case 'magic-chile':
        break;
      default:
        throw(`Not service found to ${pageName}`);
    }
  });
};

module.exports = getPageSitemap;