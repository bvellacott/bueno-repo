var buenoRepo = require('.')
buenoRepo.setupAliases()

const tap = require('tap')
var aMonoRepoPackage = require('a-mono-repo-package');

tap.equal(aMonoRepoPackage.helloWorld(), 'Hello World!');
