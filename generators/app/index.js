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
      //dot files
      ['editorconfig', 'jshintrc', 'jsbeautifyrc', 'jscsrc', 'travis.yml', 'gitignore'].forEach(file => {
        this.fs.copy(
          this.templatePath(file),
          this.destinationPath(`.${file}`)
        );
      });

      //javascript files
      this.fs.copy(
        this.templatePath('app/**'),
        this.destinationPath('./')
      );
    },
  },

  install: function() {
    this.installDependencies();
  },

  end: function() {
    this.spawnCommand('git', ['init'])
      .on('exit', () => {
        this.spawnCommand('git', ['add', '--all'])
          .on('exit', () => {
            this.spawnCommand('git', ['commit', '-m', '"initial commit from generator"']);
          });
      });

    console.log(yosay('I believe we\'re done here.'));
  },
});
