const fs = require('fs');
const path = require('path');

module.exports = function init(queue) {
  fs.readdirSync(__dirname).forEach((fileName) => {
    const extension = path.extname(fileName);
    if (extension === '.js' && fileName !== 'index.js') {
      // eslint-disable-next-line global-require
      const required = require(`./${fileName}`);
      required(queue);
    }
  });
};
