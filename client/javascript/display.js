require(["lib/engine_assembler", "game/views/display"], function (EngineAssembler, Display) {
  "use strict";

  return function() {
    var engine_config = {
      width: 900,
      height: 600,
      canvas: "game_screen",
      display: Display
    };

    return Object.create(EngineAssembler(engine_config)).run();
  }();
});
