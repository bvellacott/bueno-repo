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

try {
  // try and transform a standard module alias as if on the server side
  // should still resolve to the node standard library
  var transformAlias = require('.').transformAlias
  var stream = transformAlias('stream', '/base/dir');
  assert.equal(stream, 'stream')
  testGreen('correctly didn\'t transform the standard module alias in node')
} catch (e) {
  testRed('incorrectly transformed the standard module alias in node')
}

try {
  // try and transform a standard module alias as if in the browser
  // should resolve to the browser version
  var transformBrowserAlias = require('.').transformBrowserAlias
  var stream = transformBrowserAlias('stream', '/base/dir');
  assert.equal(stream, '/base/dir/browserModules/stream');
  testGreen('transformed the standard module alias correctly in the browser')
} catch (e) {
  testRed('failed to transform the standard module alias correctly in the browser')
}

try {
  // try and load a standard module alias as in node
  // should still resolve to the node standard library
  var stream = require('stream');
  assert.equal(typeof stream.Duplex, 'function');
  testGreen('resolved the standard module even though there is a browser override')
} catch (e) {
  testRed('failed to resolve the standard module correctly')
}
