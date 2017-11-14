const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-generator').test;

const generatorVersion = require('../package.json').version;


describe('authmaker express:app', () => {
  before((done) => {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withOptions({ skipInstall: true, 'skip-db': true })
      .withPrompts({ name: 'test-application' })
      .on('end', done);
  });

  it('creates files', () => {
    assert.file([
      'package.json',
      '.editorconfig',
      '.eslintrc.json',
      '.gitignore',
      '.travis.yml',
    ]);
  });

  it('added generator version to package.json', () => {
    assert.jsonFileContent('package.json', {
      '@authmaker/generator-express:version': generatorVersion,
    });
  });
});
