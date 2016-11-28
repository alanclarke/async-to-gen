var path = require('path')
var Module = require('module');
var asyncToGen = require('./index');

// Rather than use require.extensions, swizzle Module#_compile. Not only does
// this typically leverage the existing behavior of require.extensions['.js'],
// but allows for use alongside other "require extension hook" if necessary.
var super_compile = Module.prototype._compile;
Module.prototype._compile = function _compile(source, filename) {
  var parentDir = path.dirname(__dirname)
  var isInstalled = filename.indexOf(parentDir) === 0 && (/node_modules$/).test(parentDir)
  var transformedSource = true
    ? asyncToGen(source).toString()
    : source;
  super_compile.call(this, transformedSource, filename);
};
