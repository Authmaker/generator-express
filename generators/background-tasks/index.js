const _ = require('lodash');
const chalk = require('chalk');
const Generator = require('yeoman-generator');
const yosay = require('yosay');
const recast = require('recast');
const { readFileSync, writeFileSync } = require('fs');

const { builders } = recast.types;

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`I say it's time to make some ${chalk.green('background tasks')}, don't you!?`));

    const prompts = [
      {
        type: 'confirm',
        name: 'cron',
        message: 'Shal we make some cron taks while we\'re at it?',
        default: false,
      },
    ];

    return this.prompt(prompts).then((props) => {
      this.props = props;

      if (this.props.cron) {
        this.log(yosay('Spiffing! 🎉 Your app will be all the better for it!'));
      } else {
        this.log(yosay('Not a bother! Maybe next time? 😉'));
      }
    });
  }


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
  }

  projectfiles() {
    // javascript files
    this.fs.copy(
      this.templatePath('jobs/**'),
      this.destinationPath('./jobs')
    );

    this.fs.copy(
      this.templatePath('server/**'),
      this.destinationPath('./server')
    );

    if (this.props.cron) {
      this.fs.copy(
        this.templatePath('cron/**'),
        this.destinationPath('./cron')
      );
    }
  }


  install() {
    this.installDependencies({
      bower: false,
    });
  }

  end() {
    const code = readFileSync('./server/index.js');
    const ast = recast.parse(code);


    recast.visit(ast, {
      visitProgram(path) {
        // console.log('lkjsdf', path.value.body);

        const kue = path.value.body.filter(declaration => declaration.type === 'VariableDeclaration').find(declaration => declaration.declarations[0].id.name === 'kueServer');

        if (!kue) {
          // console.log(builders.variableDeclaration.toString())
          ast.program.body.unshift(builders.variableDeclaration('const', [
            builders.variableDeclarator(builders.identifier('kueServer'), builders.callExpression(
              builders.identifier('require'),
              [builders.literal('./kueServer')]
            )),
          ]));
        }

        this.traverse(path);
      },

      visitFunctionExpression(path) {
        if (path.value.id.name === 'initialiseServer') {
          const kueServer = path.value.body.body
            .filter(declaration => declaration.type === 'ExpressionStatement')
            .find(declaration => declaration.expression.callee.name === 'kueServer');

          if (!kueServer) {
            path.value.body.body.push(builders.expressionStatement(builders.callExpression(
              builders.identifier('kueServer'),
              [builders.identifier('app')]
            )));
          }
        }

        this.traverse(path);
      },
    });

    writeFileSync('./server/index.js', recast.print(ast, { tabWidth: 2, quote: 'single' }).code);


    if (this.props.cron) {
      this.log(`const initCron = require('./cron');

// Where queue was what we created in the previous step
initCron(queue);`);
    }

    this.log(yosay('Happy coding! 💻 \nI believe we\'re done here.'));
  }
};
