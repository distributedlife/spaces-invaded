define(["lib/window", "lib/engine"], function (window, Engine) {
    "use strict";

    return function(engine_config) {
        return {
            engine: Engine(
                new engine_config.display(engine_config.canvas, engine_config.width, engine_config.height),
                window.get_element_by_id(engine_config.canvas),
                engine_config.width, 
                engine_config.height
            ),
            run: function() { this.engine.run(); }
        };
    };
});
