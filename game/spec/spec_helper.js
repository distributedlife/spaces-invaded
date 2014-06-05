exports.requirejs = function() {
  var requirejs = require('requirejs');

  requirejs.config({
    baseUrl: __dirname + '/../client/js',
    nodeRequire: require,
    shim: {}
  });

  return requirejs;
};