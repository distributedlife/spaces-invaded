require.config({
    paths: {
      "socket.io": "../../socket.io/socket.io",
      underscore: "npm/underscore-min",
      events: "npm/events",
      bacon: "npm/bacon",
      zepto: "ext/zepto.min",
      jquery: "ext/zepto.min",
      lodash: "ext/lodash.min",
      text: 'ext/require-text',
      shader: 'ext/require-shader'
    },
    shim: {
      "ext/three": {
        init: function() {
          "use strict";
          return this.THREE;
        }
      },
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
      },
      'ext/screenfull': {
        init: function() {
          "use strict";
          return this.screenfull;
        }
      }
    }
});
