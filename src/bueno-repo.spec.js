var assert = require('assert')

function testGreen(message) {
  console.log('\x1b[32m%s\x1b[0m', message)
}

function testRed(message) {
  console.log('\x1b[31m%s\x1b[0m', message)
}

try {
  // snippet to setup the aliasing
  require('.').setupAliases()

  // require the aliased packages
  var aMonoRepoPackage = require('@my-libs/a-mono-repo-test-package');
  var anotherMonoRepoPackage = require('@my-libs/another-mono-repo-test-package');

  // verify that the packages have been resolved correctly
  assert.equal(aMonoRepoPackage.helloWorld(), 'Hello World!');
  assert.equal(anotherMonoRepoPackage.helloWorld(), 'Hello Another World!');
  testGreen('resolved the aliased packages without error')
} catch (e) {
  testRed(e.message)
  throw e
}
