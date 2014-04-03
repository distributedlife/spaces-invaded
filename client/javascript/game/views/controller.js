define(["lib/audio_emitter", "game/thing_factory", "lib/level", "lib/config", "socket.io"],
  function(AudioEmitter, ThingFactory, Level, config, io)
  {
    "use strict";

    return function(width, height, sound_manager) {
        var level = new Level(width, height);

        var left = function() {
            level.socket.emit("tank/left");
        }

        var right = function() {
            level.socket.emit("tank/right");
        }

        var shoot = function() {
            level.socket.emit("tank/shoot");
        }

        var init = function(width, height) {
            level.socket = io.connect('/views/controller');

            //LEFT AND RIGHT SHOULD BE TAPS HELD DOWN
            var left = ui_builder.build_control("left", move_left);
            var right = ui_builder.build_control("right", move_right);

            //SHOOT IS A BUTTON
            var shoot = ui_builder.build_control("shoot", shoot);
        };

        init(width, height);

        return level;
    };
});
