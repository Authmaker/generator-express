let initialised = false;

module.exports = function initMongodb(nconf) {
  if (initialised) {
    return;
  }

  require('./mongodb')(nconf);
  initialised = true;
};
