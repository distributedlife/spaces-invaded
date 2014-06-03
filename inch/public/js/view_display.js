require(["lib/assembly", "game/engine", "game/views/controller"], function (Assembly, Engine, Controller) {
  "use strict";

  return function() {
    var config = {
      width: 480,
      height: 640,
      canvas: "controller",
      game: Engine,
      display: Controller
    };

    return new Assembly(config);
  }();
});
