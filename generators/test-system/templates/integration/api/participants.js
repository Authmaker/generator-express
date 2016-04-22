var expect = require('chai').expect;
var winston = require('@blooie/common').logger;
var autoroute = require('express-autoroute');
var request = require('supertest');

var fixture = rootRequire('test/fixtures/chats');

describe("the participants api", function() {

    before(function() {
        autoroute(global.app, {
            logger: winston,
            throwErrors: true,
            routeFile: rootPath('routes/api/participants.js')
        });
    });

    beforeEach(function() {
        return fixture.init();
    });

    afterEach(function() {
        return fixture.db.reset();
    });

    it("should return an error when we have no access_token", function(done) {
        request(global.app)
            .get('/participants')
            .expect(401, done);
    });

    it("should return 401 with an invalid access_token on the request querystring", function(done) {
        request(global.app)
            .get('/participants')
            .query({
                access_token: "bad_access_token"
            })
            .expect(401, done);
    });

    it("should return 401 with a valid access_token on the request querystring but no scope", function(done) {
        request(global.app)
            .get('/participants')
            .query({
                access_token: "real_access_token_no_scope"
            })
            .expect(401, done);
    });

    it("should return 204 with a valid access_token on the request querystring and no config", function(done) {
        request(global.app)
            .get('/participants')
            .query({
                access_token: "real_access_token_with_scope"
            })
            .expect(204, done);
    });

    it("should return 204 with a valid access_token in the headers and no config", function(done) {
        request(global.app)
            .get('/participants')
            .set({
                'authorization': 'real_access_token_with_scope'
            })
            .expect(204, done);
    });

    it("should return 200 and some data with a valid access_token and a config ", function(done) {
        request(global.app)
            .get('/participants')
            .query({
                access_token: "real_access_token_with_scope_config",
                ids: [fixture.participantIds[0].toString(), fixture.participantIds[1].toString()]
            })
            .expect(200)
            .expect(function(res) {
                expect(res.body).to.have.deep.property('participants[0]');
                expect(res.body).to.have.deep.property('participants[1]');
            })
            .end(done);
    });

    it("should return 200 and one participant when accessing directly", function(done) {
        request(global.app)
            .get('/participants/' + fixture.participantIds[0].toString())
            .query({
                access_token: "real_access_token_with_scope_config"
            })
            .expect(200)
            .expect(function(res) {
                expect(res.body).to.have.deep.property('participant');
            })
            .end(done);
    });
});
