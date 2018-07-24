const fs = require('fs');
const path = require('path');
const { CronJob } = require('cron');

module.exports = function init(queue) {
  fs.readdirSync(__dirname).forEach((fileName) => {
    const extension = path.extname(fileName);
    if (extension === '.js' && fileName !== 'index.js') {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      const required = require(`./${fileName}`);

      // eslint-disable-next-line no-new
      new CronJob(required.cron, required.job(queue), null, true);
    }
  });
};
