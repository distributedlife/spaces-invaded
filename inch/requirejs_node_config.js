module.exports = function(requirejs) {
  requirejs.config({
    baseUrl: __dirname + '/client/javascript',
    nodeRequire: require,
    paths: {
      "socket.io": "/socket.io/socket.io",
      underscore: "npm/underscore-min",
      events: "npm/events",
      bacon: "npm/bacon",
      zepto: "ext/zepto.min",
      jquery: "ext/zepto.min",
      lodash: "ext/lodash.min"
    },
    shim: {
      zepto: {
        init: function() {
          "use strict";
          return this.$;
        }
      },
      underscore: {
        exports: "_"
      },
      'ext/gamepad': {
        init: function() {
          "use strict";
          return this.Gamepad;
        }
      },
      'ext/three': {
        init: function() {
          "use strict";
          return this.THREE;
        }
      },
      'ext/websocket': {
        init: function() {
          "use strict";
          return this.WebSocket;
        }
      },
      'ext/window': {
        init: function() {
          "use strict";
          return this.window;
        }
      },
      'ext/soundmanager2-nodebug-jsmin': {
        deps: ['ext/window'],
        init: function() {
          "use strict";
          return this.SoundManager;
        }
      }
    }
  });
};