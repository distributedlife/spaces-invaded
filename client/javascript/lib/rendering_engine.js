define(["lib/window"], function(window) {
  "use strict";

  return function(display, width, height) {
    return {
      resize: function(width, height) {
        display.resize(width, height);
      },
      run: function() {
        display.animate();
        window.request_animation_frame(this.run.bind(this));
      }
    };
  };
});
