'use strict';
var yeoman = require('yeoman-generator');
var _ = require('lodash');

module.exports = yeoman.generators.NamedBase.extend({
  constructor: function () {

    yeoman.generators.NamedBase.apply(this, arguments);
  },

  writing: function () {
    this.template(
      this.templatePath('_model.js.ejs'),
      this.destinationPath(`models/${_.toLower(this.name)}.js`), {
        modelName: this.name,
      }
    );
  },
});
