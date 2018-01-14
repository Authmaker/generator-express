const yeoman = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const _ = require('lodash');

const generatorVersion = require('../../package.json').version;

module.exports = yeoman.generators.Base.extend({
  // eslint-disable-next-line
  constructor: function (...args) {
    yeoman.generators.Base.apply(this, args);

    // this.log('as passed in: ', this.options.testOption);
    this.option('skip-db', {
      type: Boolean,
      defaults: false,
    });
  },

  prompting() {
    const done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the remarkable ${chalk.red('Authmaker')} generator!`));

    this.prompt([{
      type: 'confirm',
      name: 'lovelyDay',
      message: 'Are you having a lovely day?',
      default: true,
    }], (sillyProps) => {
      if (sillyProps.lovelyDay) {
        // eslint-disable-next-line max-len
        this.log(yosay(`Horray! 🎉 Let's see if we can't make it better by making some awesome software.

Let's start with getting a few details about your new project:`));
      } else {
        // eslint-disable-next-line max-len
        this.log(yosay(`Oh well that's an aweful shame 😞, let's see if we can't make some awesome software to cheer you up!

Let's get started by getting a few details about your new project:`));
      }

      const prompts = [{
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname,
      }];

      if (!this.options['skip-db']) {
        const newPrompts = [{
          type: 'input',
          name: 'dbhost',
          message: `What is your Mongo database ${chalk.red('host')}? e.g. on mlab it would be this bit ${chalk.red('ds123456.mlab.com')}:51234/your-database`,
        }, {
          type: 'input',
          name: 'dbport',
          message: `What is your Mongo database ${chalk.red('port')}? e.g. on mlab it would be this bit ds123456.mlab.com:${chalk.red('51234')}/your-database`,
        }, {
          type: 'input',
          name: 'dbname',
          message: `What is your Mongo database ${chalk.red('name')}? e.g. on mlab it would be this bit ds123456.mlab.com:51234/${chalk.red('your-database')}`,
        }, {
          type: 'input',
          name: 'dbuser',
          message: `What is your Mongo database ${chalk.red('username')}? Remember: you will have had to create a user before doing this step`,
        }, {
          type: 'input',
          name: 'dbpassword',
          message: `And finally: what is your ${chalk.red('super secret')} Mongo database ${chalk.red('password')}?`,
        }];

        newPrompts.forEach(prompt => prompts.push(prompt));
      }

      this.prompt(prompts, (props) => {
        this.props = props;

        if (!this.options['skip-db']) {
          MongoClient.connect(`mongodb://${props.dbuser}:${props.dbpassword.replace(/@/g, '%40')}@${props.dbhost}:${props.dbport}/${props.dbname}`)
            .then(() => {
              this.log(yosay(`Fantastic!! I was able to check your database credentials and everything looks great to me.

  Now let's get this show on the road!`));
            })
            .then(null, (err) => {
              this.log(yosay(`Oh no! I think there is an issue with your database credentials. The database said: ${err.message}

  Not to worry, you can run this generator again if you like or you could just update the credentials in settings/secure.json`));
            })
            .then(() => {
              done();
            });
        } else {
          done();
        }
      });
    });
  },

  writing: {
    app() {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {
          name: this.props.name.replace(' ', ''),
          generatorVersion,
        }
      );

      if (!this.options['skip-db']) {
        this.fs.copyTpl(
          this.templatePath('_secure.json'),
          this.destinationPath('settings/secure.json'),
          _.assign({}, this.props, {
            sessionSecret: crypto.randomBytes(128).toString('hex'),
          })
        );
      }
    },

    projectfiles() {
      // dot files
      ['editorconfig', 'eslintrc.json', 'travis.yml', 'gitignore'].forEach((file) => {
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
