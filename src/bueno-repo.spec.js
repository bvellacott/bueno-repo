var assert = require('assert')

function testGreen(message) {
  console.log('\x1b[32m%s\x1b[0m', message)
}

function testRed(message) {
  console.log('\x1b[31m%s\x1b[0m', message)
}

try {
  // try and resolve a dependency alias before setting them up
  var aMonoRepoPackage = require('@my-libs/a-mono-repo-test-package');
} catch (e) {
  testGreen('should fail when requiring a dependency alias without setting it up')
}

try {
  // snippet to setup the aliasing
  require('.').setupDependencyAliases()

  // require the aliased packages
  var aMonoRepoPackage = require('@my-libs/a-mono-repo-test-package');
  var anotherMonoRepoPackage = require('@my-libs/another-mono-repo-test-package');

  // verify that the packages have been resolved correctly
  assert.equal(aMonoRepoPackage.helloWorld(), 'Hello World!');
  assert.equal(anotherMonoRepoPackage.helloWorld(), 'Hello Another World!');
  testGreen('resolved the aliased dependencies without error')
} catch (e) {
  testRed(e.message)
  throw e
}

try {
  // try and resolve a local alias before setting them up
  var localModule = require('@local/module');
} catch (e) {
  testGreen('should fail when requiring a local alias without setting it up')
}

try {
  // snippet to setup the aliasing
  require('.').setupAliases()

  // require the aliased packages
  var localModule = require('@/local/module');

  // verify that the packages have been resolved correctly
  assert.equal(localModule.helloWorld(), 'Hello Local World!');
  testGreen('resolved the locally aliased module without error')
} catch (e) {
  testRed(e.message)
  throw e
}
