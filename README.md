[![Build
Status](https://travis-ci.com/bvellacott/bueno-repo.svg?branch=master&status=passed)](https://travis-ci.com/github/bvellacott/bueno-repo)
# bueno-repo
A bueno mono repo solution. 

## rant
Basically, I don't like the current mono repo solutions out there, where packages are symlinked and hoisted and what not.

## mono repos are too hard
The solution should be simple - after all, all I want is to have my libraries in the same git repo as my main app.
Personally I don't mind having to take the responsibility of versioning and publishing my packages myself, instead
of automating it and actually just losing track of what packages have actually changed, because the tool is bumping
the version of all my packages regardless of any code changes. 

## aliases are all I need
all I really need is aliases and an easy way to set them up, then my test / dev code can read the aliases to resolve
modules from within the directory structure rather than looking up an external service like npm. In production, everything
will work as normal so long as my mono repo pakages are published.

## usage
```sh
npm install --save-dev bueno-repo
```

in your package.json add the following:
```json
/* ./package.json */
{
  ...
  "moduleAliases": {
    "@your-packages/": "./path/to/your/packages/"
  }
  ...
}
```

give each of your packages a prefixed name as follows:
```json
/* ./path/to/your/packages/a-mono-repo-package/package.json */
{
  "name": "@your-packages/a-mono-repo-package",
  ...
}
```

in your test / development code add this snippet before any other code runs:
```js
require('bueno-repo').setupAliases()
```

now you can require your mono repo package as follows:
```js
require('@your-packages/a-mono-repo-package')
```

**Remember!** If your packages depend on each other, you'll have to add the moduleAliases to their `package.json` also,
and run the snippet in their respective test code

`setupAliases()` will look at `moduleAliases` by default. If you want to use module aliases in a production setup, but you also
have mono repo packages that you wish to alias in dev you can define an additional `dependencyAliases: {}` object in your
`package.json` and set them up separately in dev / test code using `setupDependencyAliases()`

## test
```sh
npm test
```
bueno repo has been tested on **node 4 - 13**

## special thanks
This project was inspired by https://github.com/ilearnio/module-alias, but I simplified the code a little.

## contributing
If you see something you want to add/change, please create a pr which contains a passing test for your changes.
