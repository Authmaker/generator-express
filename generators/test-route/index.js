const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: true });

    this.argument('fixtureName', {
      desc: 'tells the route test to use this fixture',
      type: String,
      required: false,
    });
  }

  writing() {
    this.fs.copyTpl(
      this.templatePath('_route.js.ejs'),
      this.destinationPath(`test/routes/${this.options.name}.js`), {
        fixtureName: this.options.fixtureName,
        routeName: this.options.name,
      }
    );
  }
};
