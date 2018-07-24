const kue = require('kue');
const kueUiExpress = require('kue-ui-express');
const nconf = require('nconf');

const initJobs = require('../jobs');

module.exports = (app) => {
  kueUiExpress(app, '/kue/', '/kue-api');

  const queue = kue.createQueue({
    redis: nconf.get('redis'),
  });

  initJobs(queue);

  // add convenience redirect
  app.get('/kue', (req, res) => {
    res.redirect('/kue/');
  });

  app.use('/kue-api/', kue.app);
};
