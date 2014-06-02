exports.requirejs = ( ->
  requirejs = require('requirejs')

  requirejs.config(
    baseUrl: __dirname + '/../client/javascript'
    nodeRequire: require
    shim:
      'ext/asevented':
        exports: ->
          "use strict"
          this.asEvented
  )

  requirejs
)()
