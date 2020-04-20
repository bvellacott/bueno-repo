require('.').setupAliases()

const tap = require('tap')
var aMonoRepoPackage = require('@my-libs/a-mono-repo-test-package');
var anotherMonoRepoPackage = require('@my-libs/another-mono-repo-test-package');

tap.equal(aMonoRepoPackage.helloWorld(), 'Hello World!');
tap.equal(anotherMonoRepoPackage.helloWorld(), 'Hello Another World!');
