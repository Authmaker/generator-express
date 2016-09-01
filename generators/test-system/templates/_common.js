global.rootPath = function(fileName) {
  return `${__dirname}/../${fileName}`;
};

global.rootRequire = function(fileName) {
  // eslint-disable-next-line global-require
  return require(global.rootPath(fileName));
};
