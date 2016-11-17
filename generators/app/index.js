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
        name: 'lovelyDay',
        message: 'Are you having a lovely day?',
        default: true,
      },
    ];

    this.prompt(prompts, function(props) {
      this.props = props;

      if (this.props.lovelyDay) {
        this.log(yosay('Horray! 🎉 Let\'s see if we can\'t make it better by making some awesome software'));
      } else {
        this.log(yosay('Oh well that\'s an aweful shame 😞, let\'s see if we can\'t make some awesome software to cheer you up!'));
      }

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
      ['editorconfig', 'eslintrc.json', 'travis.yml', 'gitignore'].forEach(file => {
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
