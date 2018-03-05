const path = require('path');
const generatorVersion = require('../package.json').version;

const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@authmaker/express:app', () => {
  before(() => helpers
    .run(path.join(__dirname, '../generators/app'))
    .withPrompts({ name: 'test-application' }));

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
