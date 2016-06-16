var mongoose = require('mongoose');
var mongooseConnect = require('mongoose-nconf-connect');
var winston = require('winston');

module.exports = function initMongodb(nconf) {
  if (!nconf.get('database:mongo:')) {
    throw new Error('NConf entry for database:mongo: requried to run this application');
  }

  mongooseConnect.connectGlobalMongo(nconf, mongoose, {
    configPrefix: 'database:mongo:',
    logger: winston,
  });
};
