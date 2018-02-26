const Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument('name', { type: String, required: true });
  }

  writing() {
    this.fs.copy(
      this.templatePath('_fixture.js'),
      this.destinationPath(`test/fixtures/${this.options.name}.js`)
    );
  }
};
