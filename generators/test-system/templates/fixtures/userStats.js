var moment = require('moment');

var db = require('@blooie/common').db;
var models = db.modelObjects;

var userIds = [
new db.mongoose.Types.ObjectId(),
new db.mongoose.Types.ObjectId(),
new db.mongoose.Types.ObjectId(),
new db.mongoose.Types.ObjectId()
];

module.exports = {
    init: init,
    db: db,
    userIds: userIds
};

function init(callback) {

    var usersToCreate = [
        {
            _id: userIds[0],
            username: "testuser1@bloo.ie",
            clientId: "testChatsFixture"
        },
        {
            _id: userIds[1],
            username: "testuser2@bloo.ie",
            clientId: "testChatsFixture"
        },
        {
            _id: userIds[2],
            username: "testuser3@bloo.ie",
            clientId: "testChatsFixture"
        },
        {
            _id: userIds[3],
            username: "testuser4@bloo.ie",
            clientId: "testChatsFixture"
        }
    ];

    var domainsToCreate = [{
        websiteUrl: "face.com",
        _id: new db.mongoose.Types.ObjectId()
    }];

    var accountsToCreate = [{
        users: [userIds[2]],
        stripeId: "iswearicanpay",
        domains: [domainsToCreate[0]._id]
    }];

    var analyticsToCreate = [
        {
            date: moment().subtract(1, 'hours').toDate(),
            category: 'pageView',
            value: {
                clientDomain: 'face.com',
                url: "http://face.com/your/face/is",
                userId: userIds[3].toString()
            }
        }
    ];

    var sessionsToCreate = [
        {
            userId: userIds[1],
            access_token: 'real_access_token_no_scope',
            expiryDate: moment().endOf('month').toDate()
        },
        {
            userId: userIds[0].toString(),
            access_token: 'real_access_token_with_scope',
            expiryDate: moment().endOf('month').toDate(),
            "scopes": [
                "client_dashboard"
            ]
        },
        {
            userId: userIds[2].toString(),
            access_token: 'real_access_token_with_scope_config',
            expiryDate: moment().endOf('month').toDate(),
            "scopes": [
                "client_dashboard"
            ]
        },
        {
            access_token: 'expired_access_token',
            expiryDate: moment().startOf('month').toDate()
        }
    ];

    var promise = models.oauth_sessions.create(sessionsToCreate).then(function() {
        return models.users.create(usersToCreate);
    }).then(function() {
        return models.account.create(accountsToCreate);
    }).then(function() {
        return models.configItem.create(domainsToCreate);
    }).then(function() {
        return models.analytics.create(analyticsToCreate);
    });

    if (!callback) {
        return promise;
    }

    promise.then(function() {
        callback();
    }, function(err) {
        callback(err);
    });
}
