require(["lib/rendering_engine_assembler", "game/views/display", "lib/window", "zepto"], function (RenderingEngineAssembler, Display, window, $) {
  "use strict";

  return function() {
    var engine_config = {
    	display_config: {
    		observer: true
    	},
		display: Display
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});