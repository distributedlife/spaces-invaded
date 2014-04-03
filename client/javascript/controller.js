require(["lib/assembly", "game/engine", "game/views/display"], function (Assembly, Engine, Display) {
  "use strict";

  return function() {
    var config = {
      width: 900,
      height: 600,
      canvas: "game_screen",
      game: Engine,
      display: Display
    };

    return new Assembly(config);
  }();
});
