

var assert = require('assert')

module.exports = {
  beforeAll: function() {
    // snippet to setup the aliasing
    require('.').setupAliases()
  },

  resolvesTheAliases: function() {
    // require the aliased packages
    var aMonoRepoPackage = require('@my-libs/a-mono-repo-test-package');
    var anotherMonoRepoPackage = require('@my-libs/another-mono-repo-test-package');
    
    // verify that the packages have been resolved correctly
    assert.equal(aMonoRepoPackage.helloWorld(), 'Hello World!');
    assert.equal(anotherMonoRepoPackage.helloWorld(), 'Hello Another World!');
  },
}
