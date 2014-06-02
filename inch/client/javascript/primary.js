//Level is set in the haml file as a global. This stops us from having to 
//define a new requirejs entry point for each and every level. A better 
//solution would be to pass a parameter via requirejs.
require(["lib/rendering_engine_assembler", level], function (RenderingEngineAssembler, BoundLevelModule) {
  "use strict";

  return function() {
    var engine_config = {
  		display_config: {
  			controls: ['keyboard', 'gamepad']
  		},
  		display: BoundLevelModule,
      webgl: true
    };

    Object.create(RenderingEngineAssembler(engine_config)).run();
  }();
});
