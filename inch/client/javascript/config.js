require.config({
    paths: {
      "socket.io": "../../socket.io/socket.io",
      "socket.io-client": "../../socket.io/socket.io",
      underscore: "npm/underscore-min",
      events: "npm/events",
      bacon: "npm/bacon",
      zepto: "ext/zepto.min",
      jquery: "ext/zepto.min",
      lodash: "ext/lodash.min",
      text: 'ext/require-text',
      shader: 'ext/require-shader',
      game: "../../game/client/js",
    },
    shim: {
      "ext/three": {
        init: function() {
          "use strict";
          return this.THREE;
        }
      },
      "ext/three/EffectComposer": {
        deps: ["ext/three", "ext/three/shaders/CopyShader", "ext/three/passes/ShaderPass", "ext/three/passes/MaskPass"],
        init: function(THREE) {
          "use strict";
          return this.THREE.EffectComposer;
        }
      },
      "ext/three/passes/BloomPass": {
        deps: ["ext/three", "ext/three/shaders/CopyShader", "ext/three/shaders/ConvolutionShader"],
        init: function(THREE) {
          "use strict";
          return this.THREE.BloomPass;
        }
      },
      "ext/three/passes/MaskPass": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.MaskPass;
        }
      },
      "ext/three/passes/RenderPass": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.RenderPass;
        }
      },
      "ext/three/passes/ShaderPass": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.ShaderPass;
        }
      },
      "ext/three/shaders/BleachBypassShader": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.ConvolutionShader;
        }
      },
      "ext/three/shaders/ConvolutionShader": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.ConvolutionShader;
        }
      },
      "ext/three/shaders/CopyShader": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.CopyShader;
        }
      },
      "ext/three/shaders/DotScreenShader": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.DotScreenShader;
        }
      },
      "ext/three/shaders/HorizontalBlurShader": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.HorizontalBlurShader;
        }
      },
      "ext/three/shaders/VerticalBlurShader": {
        deps: ["ext/three"],
        init: function(THREE) {
          "use strict";
          return this.THREE.HorizontalBlurShader;
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
      },
      'lib/particle_engine': {
        deps: ['ext/ShaderParticleUtils', 'ext/ShaderParticleGroup', 'ext/ShaderParticleEmitter'],
        init: function() {
          "use strict";
          return SPE;
        }
      }
    }
});
