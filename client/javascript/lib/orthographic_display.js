define(["lodash", "ext/three", "lib/grid_view", "lib/any_old_display"], function(_, THREE, GridView, AnyOldDisplay) {
  "use strict";

  return function(element, width, height, options) {
    var setup_camera = function() {
      var camera = new THREE.OrthographicCamera(0, width, 0, height, -2000, 1000);
      camera.position.z = 1;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      return camera;
    };

    var create_a_scene = function() {
      var scene = new THREE.Scene();
      scene.add(Object.create(GridView(width, height)).grid);
      return scene;
    };

    var display = Object.create(AnyOldDisplay(element, width, height, options)) ;
    _.extend(display, {
      camera: setup_camera(),
      scene: create_a_scene(),

      add_to_scene: function() { _.each(arguments, function(mesh) { this.scene.add(mesh); }.bind(this)); },
      resize: function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      }
    });    

    return display;
  };
});
