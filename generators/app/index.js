'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the remarkable ' + chalk.red('StonecircleExpress') + ' generator!'
    ));

    var prompts = [
      {
        type: 'confirm',
        name: 'someOption',
        message: 'Would you like to enable this option?',
        default: true,
      },
    ];

    this.prompt(prompts, function(props) {
      this.props = props;

      // To access props later use this.props.someOption;

      done();
    }.bind(this));
  },

  writing: {
    app: function() {
      this.fs.copy(
        this.templatePath('_package.json'),
        this.destinationPath('package.json')
      );
    },

    projectfiles: function() {
      ['editorconfig', 'jshintrc', 'jsbeautifyrc', 'jscsrc', 'travis.yml'].forEach(file => {
        this.fs.copy(
          this.templatePath(file),
          this.destinationPath(`.${file}`)
        );
      });
    },
  },

  install: function() {
    this.installDependencies();
  },
});
