var buenoRepo = require('.')
buenoRepo.setupAliases()

var assert = require('assert');

var aMonoRepoPackage = require('a-mono-repo-package');

describe('bueno-repo', function () {
  it('should resolve a-mono-repo-package and print Hello World!', function() {
    assert.equal(aMonoRepoPackage.helloWorld(), 'Hello World!');
  });
});
