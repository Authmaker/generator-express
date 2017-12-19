const http = require('http');
const express = require('express');
const authmakerVerifyExpress = require('authmaker-verify-express');
const Q = require('q');
const nconf = require('nconf');

Q.longStackSupport = true;

nconf.defaults({
  authmaker: {
    mongo: {
      db: 'your-test-database-here',
      host: 'localhost',
      port: 27017,
    },
  },
});

before(function () {
  global.app = express();

  // create http server
  global.httpServer = http.createServer(global.app).listen(56773);
  return authmakerVerifyExpress.connectMongo(nconf);
});

after(function (done) {
  global.httpServer.close(done);
});
