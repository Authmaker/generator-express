'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');

_.mixin({
  sortKeysBy: function(obj, comparator) {
    var keys = _.sortBy(_.keys(obj), function(key) {
      return comparator ? comparator(obj[key], key) : key;
    });

    return _.fromPairs(keys, _.map(keys, function(key) {
      return obj[key];
    }));
  },
});

module.exports = yeoman.generators.Base.extend({

  createTestFoler: function() {
    this.mkdir('test');

    this.fs.copy(
      this.templatePath('_jshintrc'),
      this.destinationPath('test/.jshintrc')
    );

    this.fs.copy(
      this.templatePath('_common.js'),
      this.destinationPath('test/common.js')
    );

    this.fs.copy(
      this.templatePath('_index.js'),
      this.destinationPath('test/index.js')
    );

    //add elements to the package.json
    var existingJson = this.fs.readJSON(this.destinationPath('package.json'));

    existingJson.scripts = _.sortKeysBy(_.assign({}, existingJson.scripts, this.fs.readJSON(this.templatePath('package/_scripts.json'))));
    existingJson.devDependencies = _.sortKeysBy(_.assign({}, existingJson.devDependencies, this.fs.readJSON(this.templatePath('package/_devDependencies.json'))));

    this.fs.writeJSON(this.destinationPath('package.json'), existingJson);
  },

  install: function() {
    this.installDependencies();
  },
});
