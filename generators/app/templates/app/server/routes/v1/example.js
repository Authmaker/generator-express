const autorouteJson = require('express-autoroute-json');
const models = require('../../../models');

module.exports.autoroute = autorouteJson({
  model: models.amenity,
  resource: 'example', // this will be pluralised in the routes

  // default CRUD
  find: {},
  create: {},
  update: {},
  delete: {},
});
