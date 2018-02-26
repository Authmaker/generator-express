const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const { MongoClient } = require('mongodb');
const crypto = require('crypto');
const _ = require('lodash');
const { basename } = require('path');

const generatorVersion = require('../../package.json').version;

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.option('skip-db', {
      type: Boolean,
      defaults: false,
    });
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Welcome to the remarkable ${chalk.red('Authmaker')} generator!`));

    return this.prompt([{
      type: 'confirm',
      name: 'lovelyDay',
      message: 'Are you having a lovely day?',
      default: true,
    }]).then((sillyProps) => {
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
        default: basename(this.contextRoot),
      }];

      if (!this.options['skip-db']) {
        const newPrompts = [{
          type: 'input',
          name: 'connectionString',
          message: `What is your Mongo ${chalk.red('connection string')}? e.g. on mlab it would look like this ${chalk.red('mongodb://<dbuser>:<dbpassword>@ds12345.mlab.com:12345/your-database')}. Remember to replace dbuser and dbpassword`,
        }];

        newPrompts.forEach(prompt => prompts.push(prompt));
      }

      return this.prompt(prompts).then((props) => {
        this.props = props;

        if (!this.options['skip-db']) {
          return MongoClient.connect(props.connectionString)
            .then((client) => {
              this.log(yosay(`Fantastic!! I was able to check your database credentials and everything looks great to me.

  Now let's get this show on the road!`));
              client.close();
            })
            .then(null, (err) => {
              this.log(yosay(`Oh no! I think there is an issue with your database credentials. The database said: ${err.message}

  Not to worry, you can run this generator again if you like or you could just update the credentials in settings/secure.json`));
            });
        }
      });
    });
  }


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
  }

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
  }


  install() {
    this.installDependencies({
      bower: false,
    });
  }

  end() {
    this.spawnCommand('git', ['init'])
      .on('exit', () => {
        this.spawnCommand('git', ['add', '--all'])
          .on('exit', () => {
            this.spawnCommand('git', ['commit', '-m', '"initial commit from generator"']);
          });
      });

    this.log(yosay('I believe we\'re done here.'));
  }
};
