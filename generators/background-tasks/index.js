const _ = require('lodash');
const chalk = require('chalk');
const yeoman = require('yeoman-generator');
const yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  prompting() {
    const done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      `I say it's time to make some ${chalk.green('background tasks')}, don't you!?`
    ));

    const prompts = [
      {
        type: 'confirm',
        name: 'cron',
        message: 'Shal we make some cron taks while we\'re at it?',
        default: false,
      },
    ];

    this.prompt(prompts, props => {
      this.props = props;

      if (this.props.cron) {
        this.log(yosay('Spiffing! 🎉 Your app will be all the better for it!'));
      } else {
        this.log(yosay('Not a bother! Maybe next time? 😉'));
      }

      done();
    });
  },

  writing: {
    packageJson() {
      // add elements to the package.json
      const existingJson = this.fs.readJSON(this.destinationPath('package.json'));

      existingJson.dependencies = _.assign(
        {},
        existingJson.dependencies,
        this.fs.readJSON(this.templatePath('package/_dependencies.json'))
      );

      if (this.props.cron) {
        existingJson.dependencies = _.assign(
          {},
          existingJson.dependencies,
          this.fs.readJSON(this.templatePath('package/_dependencies_cron.json'))
        );
      }

      this.fs.writeJSON(this.destinationPath('package.json'), existingJson);
    },

    projectfiles() {
      // javascript files
      this.fs.copy(
        this.templatePath('jobs/**'),
        this.destinationPath('./')
      );

      if (this.props.cron) {
        this.fs.copy(
          this.templatePath('cron/**'),
          this.destinationPath('./')
        );
      }
    },
  },

  install() {
    this.installDependencies();
  },

  end() {
    // eslint-disable-next-line max-len
    this.log(yosay('As we have not yet figured out how to do this for you, please add this to your app.js file:'));

    this.log(`// Import job initialiser
const initJobs = require('./jobs');

// Initialise the queue
const queue = kue.createQueue({
redis: nconf.get('redis'),
});

// Initialise Jobs
initJobs(queue);

// Access Kue UI via http://localhost:3000/kue
app.use('/kue', kue.app);`);

    if (this.props.cron) {
      this.log(`const initCron = require('./cron');

// Where queue was what we created in the previous step
initCron(queue);`);
    }

    this.log(yosay('Happy coding! 💻 \nI believe we\'re done here.'));
  },
});
