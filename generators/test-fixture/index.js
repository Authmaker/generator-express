'use strict';
var yeoman = require('yeoman-generator');

module.exports = yeoman.generators.NamedBase.extend({
  writing: function() {
    this.fs.copy(
      this.templatePath('_fixture.js'),
      this.destinationPath(`test/fixtures/${this.name}.js`)
    );
  }
});
