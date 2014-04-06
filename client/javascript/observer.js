require(["lib/rendering_engine_assembler", "game/views/display", "lib/window", "zepto"], function (RenderingEngineAssembler, Display, window, $) {
  "use strict";

  return function() {
    var engine_config = {
      display: Display,
      observer: true
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});
