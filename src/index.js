var path = require('path')
var pkgJson = require(path.join(process.cwd(), 'package.json'))
const BuiltinModule = require('module')

// Guard against poorly mocked module constructors
var Module = module.constructor.length > 1
  ? module.constructor
  : BuiltinModule

var moduleAliases = (pkgJson.moduleAliases || {})
var aliases = []
for (var alias in moduleAliases) {
  aliases.push({
    regex: new RegExp(alias),
    aliasedPath: moduleAliases[alias],
  })
}

function transformAlias(requiredPath, basedir) {
  basedir = basedir || process.cwd()
  for (var i = 0; i < aliases.length; i++) {
    var alias = aliases[i]
    if (alias.regex.test(requiredPath)) {
      var noAlias = requiredPath.replace(alias.regex, '')
      return path.join(basedir, alias.aliasedPath, noAlias)
    }
  }
  return requiredPath;
}

function setupAliases() {
  var oldResolveFilename = Module._resolveFilename
  Module._resolveFilename = function (request, parentModule, isMain, options) {
    var transformedRequest = transformAlias(request)
    return oldResolveFilename.call(this, transformedRequest, parentModule, isMain, options)
  }	
}

exports.transformAlias = transformAlias
exports.setupAliases = setupAliases
