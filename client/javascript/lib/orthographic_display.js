define(["underscore", "ext/three", "lib/grid_view", "lib/any_old_display"], function(_, THREE, GridView, AnyOldDisplay) {
  "use strict";

  return function(width, height) {
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

    var add_orthographic_display_funcs = function(base_display) {
      base_display.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      };
      base_display.camera = setup_camera();
      base_display.scene = create_a_scene();
      base_display.add_to_scene = function() { _.each(arguments, function(mesh) { this.scene.add(mesh); }.bind(this)); };

      return base_display;
    };

    return add_orthographic_display_funcs(Object.create(AnyOldDisplay));
  };
});
