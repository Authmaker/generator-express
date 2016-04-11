var expect = require('chai').expect;
var winston = require('@blooie/common').logger;
var autoroute = require('express-autoroute');
var request = require('supertest');
var sinon = require('sinon');
var Q = require('q');

var redis = rootRequire('db/redis');
var fixture = rootRequire('test/fixtures/userStats');

var getUserSockets;

describe("the userStats api", function() {

    before(function() {
        autoroute(global.app, {
            logger: winston,
            throwErrors: true,
            routeFile: rootPath('routes/api/userStats.js')
        });
    });

    beforeEach(function() {
        getUserSockets = sinon.stub(redis, 'getUserSockets');
        return fixture.init();
    });

    afterEach(function() {
        redis.getUserSockets.restore();
        return fixture.db.reset();
    });

    it("should return an 401 error when we have no access_token", function(done) {
        request(global.app)
            .get('/userStats')
            .expect(401)
            .end(done);
    });

    it("should return an 401 error with valid access_token but no scope", function(done) {
        request(global.app)
            .get('/userStats')
            .query({
                access_token: "real_access_token_no_scope"
            })
            .expect(401)
            .end(done);
    });

    it("should return an 204 when we have valid access_token but no config", function(done) {
        request(global.app)
            .get('/userStats')
            .query({
                access_token: "real_access_token_with_scope"
            })
            .expect(204)
            .end(done);
    });

    it("should return an 200 when we have valid access_token with a config", function(done) {
        getUserSockets.returns(Q([]));
        request(global.app)
            .get('/userStats')
            .query({
                access_token: "real_access_token_with_scope_config"
            })
            .expect(200)
            .end(done);
    });

    it("should return an 200 and some data when we have valid access_token with a config that has user stats available", function(done) {

        getUserSockets.returns(Q([fixture.userIds[3].toString()]));

        request(global.app)
            .get('/userStats')
            .query({
                access_token: "real_access_token_with_scope_config"
            })
            .expect(200)
            .expect(function(res) {
                expect(res.body).to.have.deep.property('userStats[0]');
            })
            .end(done);
    });

    it("should return an 200 and some data with last access times when we have valid access_token with a config that has user stats available", function(done) {
        getUserSockets.returns(Q([fixture.userIds[3].toString()]));

        request(global.app)
            .get('/userStats')
            .query({
                access_token: "real_access_token_with_scope_config"
            })
            .expect(200)
            .expect(function(res) {
                expect(res.body).to.have.deep.property('userStats[0]');
                expect(res.body.userStats[0]).to.have.deep.property('lastAccess');
            })
            .end(done);
    });
});
