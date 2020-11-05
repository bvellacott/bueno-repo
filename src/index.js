var path = require('path')
var pkgJson = require(path.join(process.cwd(), 'package.json'))
const BuiltinModule = require('module')

// Guard against poorly mocked module constructors
var Module = module.constructor.length > 1
  ? module.constructor
  : BuiltinModule

var builtinModules = require("module").builtinModules || [
  '_http_agent',       '_http_client',        '_http_common',
  '_http_incoming',    '_http_outgoing',      '_http_server',
  '_stream_duplex',    '_stream_passthrough', '_stream_readable',
  '_stream_transform', '_stream_wrap',        '_stream_writable',
  '_tls_common',       '_tls_wrap',           'assert',
  'async_hooks',       'buffer',              'child_process',
  'cluster',           'console',             'constants',
  'crypto',            'dgram',               'dns',
  'domain',            'events',              'fs',
  'http',              'http2',               'https',
  'inspector',         'module',              'net',
  'os',                'path',                'perf_hooks',
  'process',           'punycode',            'querystring',
  'readline',          'repl',                'stream',
  'string_decoder',    'sys',                 'timers',
  'tls',               'trace_events',        'tty',
  'url',               'util',                'v8',
  'vm',                'worker_threads',      'zlib'
]

var builtins = {}
for (var i = 0; i < builtinModules.length; i++) {
  builtins[builtinModules[i]] = true
}

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

function transformBrowserAlias(requiredPath, basedir, aliases) {
  return transformAlias(requiredPath, basedir, aliases, true)
}

function transformAlias(requiredPath, basedir, aliases, isBrowser) {
  if (!isBrowser && builtins[requiredPath]) {
    return requiredPath
  }
  aliases = aliases || allAliases
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
  for (var i = 0; i < aliases.length; i++) {
    allAliases.push(aliases[i])	
  }
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

exports.allAliases = moduleAliases
exports.moduleAliases = moduleAliases
exports.dependencyAliases = dependencyAliases
exports.createAliasReqularExpressions = createAliasReqularExpressions
exports.transformAlias = transformAlias
exports.transformBrowserAlias = transformBrowserAlias
exports.setupAliases = setupAliases
exports.setupDependencyAliases = setupDependencyAliases
