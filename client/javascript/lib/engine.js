define(["lib/window", "lib/scene_renderer"], function(window, SceneRenderer) {
  "use strict";

  return function(display, element, width, height) {
    var build_scene_renderer = function() {
      var scene_renderer = Object.create(SceneRenderer(display.scene, display.camera));
      scene_renderer.resize(width, height);
      element.appendChild(scene_renderer.renderer.domElement);

      return scene_renderer;
    };

    return {
      scene_renderer: build_scene_renderer(),    
      run: function() {
        this.scene_renderer.animate();
        window.request_animation_frame(this.run.bind(this));
      }
    };
  };
});
