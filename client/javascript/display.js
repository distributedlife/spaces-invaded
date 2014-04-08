require(["lib/rendering_engine_assembler", "game/views/display"], function (RenderingEngineAssembler, Display) {
  "use strict";

  return function() {
    var engine_config = {
  		display_config: {
  			controls: ['keyboard', 'gamepad']
  		},
  		display: Display,
      webgl: true
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});
