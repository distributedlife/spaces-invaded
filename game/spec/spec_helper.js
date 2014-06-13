exports.requirejs = function() {
  var requirejs = require('requirejs');

  requirejs.config({
    baseUrl: __dirname + '/../client/js',
    nodeRequire: require,
    paths: {
      lodash: "../../../inch/public/js/ext/lodash.min"
    },
    shim: {}
  });

  return requirejs;
};