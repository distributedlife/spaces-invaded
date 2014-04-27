define(["lib/window", "lib/rendering_engine", "lib/dimensions"], function (window, RenderingEngine, dimensions) {
    "use strict";

    return function(config) {
        config.ratio = config.ratio || 26/10;
        var screen = dimensions(config.ratio);

        config.canvas = config.canvas || "canvas";
        config.width = config.width || screen.width;
        config.height = config.height || screen.height;
        config.display_config = config.display_config || {};
        config.display_config.controls = config.display_config.controls || [];

        var display = new config.display(config.canvas, config.width, config.height, config.display_config);
        display.connect_to_server();

        if (!config.webgl) {
            return {
                resize: function() {},
                engine: {},
                run: function() {}
            }
        } else {
            var engine_assembler = {
                resize: function() {
                    var screen = dimensions(config.ratio);

                    $("#"+config.canvas).css("margin-top", screen.margin);
                    $("#"+config.canvas).css("width", screen.width);
                    $("#"+config.canvas).css("height", screen.height);
                    
                    this.engine.resize(screen.width, screen.height);
                },
                engine: RenderingEngine(
                    display,
                    window.get_element_by_id(config.canvas),
                    config.width, 
                    config.height
                ),
                run: function() { this.engine.run(); }
            };
        }

        $(window).on('load resize', engine_assembler.resize.bind(engine_assembler));
        engine_assembler.resize();

        return engine_assembler;
    };
});
