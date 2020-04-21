var path = require('path')
var pkgJson = require(path.join(process.cwd(), 'package.json'))
const BuiltinModule = require('module')

// Guard against poorly mocked module constructors
var Module = module.constructor.length > 1
  ? module.constructor
  : BuiltinModule


function createAliasReqularExpressions(aliasesMap) {
  var aliases = []
  for (var alias in aliasesMap) {
    aliases.push({
      regex: new RegExp(alias),
      aliasedPath: aliasesMap[alias],
    })
  }
  return aliases
}

var moduleAliases
var dependencyAliases
var allAliases = []

function transformAlias(requiredPath, basedir, aliases) {
  aliases = aliases || moduleAliases
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

var oldResolveFilename = Module._resolveFilename
Module._resolveFilename = function (request, parentModule, isMain, options) {
  var transformedRequest = transformAlias(request, process.cwd(), allAliases)
  return oldResolveFilename.call(this, transformedRequest, parentModule, isMain, options)
}	

function setupAliases(aliases) {
  if (!aliases) {
    return setupModuleAliases()
  }
  allAliases = allAliases.concat(aliases)	
}

function setupModuleAliases() {
  if (moduleAliases) {
    throw new Error('moduleAliases have already been setup')
  }
  var moduleAliases = createAliasReqularExpressions(pkgJson.moduleAliases || {})
  setupAliases(moduleAliases)
}

function setupDependencyAliases() {
  if (dependencyAliases) {
    throw new Error('dependencyAliases have already been setup')
  }
  var dependencyAliases = createAliasReqularExpressions(pkgJson.dependencyAliases || {})
  setupAliases(dependencyAliases)
}

exports.moduleAliases = moduleAliases
exports.dependencyAliases = dependencyAliases
exports.createAliasReqularExpressions = createAliasReqularExpressions
exports.transformAlias = transformAlias
exports.setupAliases = setupAliases
exports.setupDependencyAliases = setupDependencyAliases
