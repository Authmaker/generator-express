const yeoman = require('yeoman-generator');
const _ = require('lodash');

_.mixin({
  sortKeysBy(obj, comparator) {
    const keys = _.sortBy(_.keys(obj), (key) => (comparator ? comparator(obj[key], key) : key));

    return _.fromPairs(keys, _.map(keys, (key) => obj[key]));
  },
});

module.exports = yeoman.generators.Base.extend({

  createTestFoler() {
    this.mkdir('test');

    this.fs.copy(
      this.templatePath('_eslintrc.json'),
      this.destinationPath('test/.eslintrc.json')
    );

    this.fs.copy(
      this.templatePath('_common.js'),
      this.destinationPath('test/common.js')
    );

    this.fs.copy(
      this.templatePath('_index.js'),
      this.destinationPath('test/index.js')
    );

    // add elements to the package.json
    const existingJson = this.fs.readJSON(this.destinationPath('package.json'));

    existingJson.scripts = _.assign(
      {},
      existingJson.scripts,
      this.fs.readJSON(this.templatePath('package/_scripts.json'))
    );


    existingJson.devDependencies = _.assign(
      {},
      existingJson.devDependencies,
      this.fs.readJSON(this.templatePath('package/_devDependencies.json'))
    );


    this.fs.writeJSON(this.destinationPath('package.json'), existingJson);
  },

  install() {
    this.installDependencies();
  },
});
