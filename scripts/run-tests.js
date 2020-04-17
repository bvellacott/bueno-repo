var Mocha = require('mocha')
var fs = require('fs')
var path = require('path');

var  mocha = new Mocha();

var testDir = './src'
fs.readdirSync(testDir).filter(function(file) {
  return file.substr(-7) === 'spec.js';
}).forEach(function(file) {
  mocha.addFile(
    path.join(testDir, file)
  );
});

mocha.run(function(failures) {
  process.exitCode = failures ? 1 : 0;
});
