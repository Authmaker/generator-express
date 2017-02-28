const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

const generatorVersion = require('../../package.json').version;

module.exports = yeoman.generators.Base.extend({
  prompting() {
    const done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      `Welcome to the remarkable ${chalk.red('StonecircleExpress')} generator!`
    ));

    const prompts = [
      {
        type: 'confirm',
        name: 'lovelyDay',
        message: 'Are you having a lovely day?',
        default: true,
      },
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
      },
    ];

    this.prompt(prompts, props => {
      this.props = props;

      if (this.props.lovelyDay) {
        // eslint-disable-next-line max-len
        this.log(yosay('Horray! 🎉 Let\'s see if we can\'t make it better by making some awesome software'));
      } else {
        // eslint-disable-next-line max-len
        this.log(yosay('Oh well that\'s an aweful shame 😞, let\'s see if we can\'t make some awesome software to cheer you up!'));
      }

      // To access props later use this.props.someOption;
      done();
    });
  },

  writing: {
    app() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          name: this.props.name,
          generatorVersion,
        }
      );
    },

    projectfiles() {
      // dot files
      ['editorconfig', 'eslintrc.json', 'travis.yml', 'gitignore'].forEach(file => {
        this.fs.copy(
          this.templatePath(file),
          this.destinationPath(`.${file}`)
        );
      });

      // javascript files
      this.fs.copy(
        this.templatePath('app/**'),
        this.destinationPath('./')
      );
    },
  },

  install() {
    this.installDependencies();
  },

  end() {
    this.spawnCommand('git', ['init'])
      .on('exit', () => {
        this.spawnCommand('git', ['add', '--all'])
          .on('exit', () => {
            this.spawnCommand('git', ['commit', '-m', '"initial commit from generator"']);
          });
      });

    this.log(yosay('I believe we\'re done here.'));
  },
});
