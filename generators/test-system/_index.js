var http = require('http');
var express = require('express');
var authmakerVerifyExpress = require('authmaker-verify-express');

var httpServer;

var nconf = require('nconf');

nconf.defaults({
  mongo: {
    authmaker: {
      db: 'your-test-database-here',
      host: 'localhost',
      port: 27017,
    },
  },
});

before(function() {
  global.app = express();

  //create http server
  httpServer = http.createServer(global.app).listen(56773);
  authmakerVerifyExpress.connectMongo(nconf);
});

after(function(done) {
  httpServer.close(done);
});
