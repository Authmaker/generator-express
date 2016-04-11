var autoroute = require('express-autoroute');
var expect = require('chai').expect;
var request = require('supertest');

var fixture = rootRequire('test/fixtures/chats');

describe("the chats api", function() {

    before(function() {
        autoroute(global.app, {
            throwErrors: true,
            routeFile: rootPath('routes/api/chats.js')
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
            .get('/chats')
            .expect(401, done);
    });

    it("should return 401 with an invalid access_token on the request querystring", function(done) {
        request(global.app)
            .get('/chats')
            .query({
                access_token: "bad_access_token"
            })
            .expect(401, done);
    });

    it("should return 401 with an invalid access_token in the headers", function(done) {
        request(global.app)
            .get('/chats')
            .query({
                access_token: "bad_access_token"
            })
            .expect(401, done);
    });

    it("should return 401 with a valid access_token on the request querystring but no scope", function(done) {
        request(global.app)
            .get('/chats')
            .query({
                access_token: "real_access_token_no_scope"
            })
            .expect(401, done);
    });

    it("should return 401 with a valid access_token in the headers but no scope", function(done) {
        request(global.app)
            .get('/chats')
            .set({
                'authorization': 'real_access_token_no_scope'
            })
            .expect(401, done);
    });

    it("should return 204 with a valid access_token on the request querystring and no config", function(done) {
        request(global.app)
            .get('/chats')
            .query({
                access_token: "real_access_token_with_scope"
            })
            .expect(204, done);
    });

    it("should return 204 with a valid access_token in the headers and no config", function(done) {
        request(global.app)
            .get('/chats')
            .set({
                'authorization': 'real_access_token_with_scope'
            })
            .expect(204, done);
    });

    it("Should authorise chats using clientId when accessing as a Client", function(done) {
        request(global.app)
            .get('/chats')
            .set({
                'authorization': 'client_id_adimin_access_token'
            })
            .expect(function(res) {
                expect(res.body).to.have.deep.property('chats[0]');
                expect(res.body).to.have.deep.property('chats.length', 1);
            })
            .end(done);
    });
});
