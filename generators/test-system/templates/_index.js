var http = require('http');

var dbConnectionFunction = require('your_db').connect;

var httpServer;

before(function() {
    global.app = rootRequire('app/express');
    //create http server
    httpServer = http.createServer(global.app).listen(56773);
    dbConnectionFunction(config);
});

after(function(done) {
    httpServer.close(done);
});
