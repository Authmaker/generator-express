const authmakerVerifyExpress = require('authmaker-verify-express');
const mongoose = require('mongoose');
const mongooseConnect = require('mongoose-nconf-connect');
const winston = require('winston');

module.exports = function initMongodb(nconf) {
  if (!nconf.get('database:mongo')) {
    throw new Error('NConf entry for database:mongo: requried to run this application');
  }

  return mongooseConnect.connectGlobalMongo(nconf, mongoose, {
    configPrefix: 'database:mongo:',
    logger: winston,
  })
  .then(() => authmakerVerifyExpress.init(nconf));
};
