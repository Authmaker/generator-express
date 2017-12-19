const moment = require('moment');
const mongoose = require('mongoose');
const Q = require('q');

const models = require('your_db').models;

const usersToCreate = [
  {
    _id: mongoose.Types.ObjectId(),
    username: 'testuser1@stonecircle.io',
    clientId: 'testChatsFixture',
    date: moment().subtract(1, 'hours').toDate(),
  },
];

const chatsToCreate = [
  {
    clientDomain: 'chats.face.com',
    participants: [
      {
        _id: usersToCreate[0]._id,
      },
    ],
  },
];

function init() {
  return models.users.create(usersToCreate)
    .then(() => models.chats.create(chatsToCreate))
    .then(() => models.users.create(usersToCreate));
}

function reset() {
  // only allow this in test
  if (process.env.NODE_ENV === 'test') {
    const collections = mongoose.connection.collections;

    const promises = Object.keys(collections).map(collection => Q.ninvoke(collections[collection], 'remove'));

    return Q.all(promises);
  }
  const errorMessage = 'Excuse me kind sir, but may I enquire as to why you are currently running reset() in a non test environment? I do propose that it is a beastly thing to do and kindly ask you to refrain from this course of action. Sincerely yours, The Computer.';
  console.log(errorMessage);
  console.error(errorMessage);
  throw new Error(errorMessage);
}

module.exports = {
  init,
  reset,
  models,
};
