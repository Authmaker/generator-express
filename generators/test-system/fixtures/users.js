/*
General requires
*/
var mongoose = require('mongoose');

var passwordHelper = require('@blooie/common').passwordHelper;

/*
Model require
*/
var db = require('@blooie/common').db;
var models = db.modelObjects;

module.exports = {
    init: init,
    models: models,
    data: {},
    reset: db.reset,
    passwordHelper: passwordHelper
};

function init() {

    module.exports.data.users = [{
        _id: new mongoose.Types.ObjectId(),
        email: 'test@bloo.ie',
        password: passwordHelper.generate_password('password'),
        displayName: 'Test!',
        websiteUrl: 'https://local.bloo.ie'
    }, {
        activated: true,
        username: 'username_4',
        clientId: 'workingClientId_2',
        password: passwordHelper.generate_password('username_2'),
        displayName: 'Moneybags',
        stripeId: 'cus_4Zmm7wVBKOsoul'
    }];

    return models.users.create(module.exports.data.users);
}
