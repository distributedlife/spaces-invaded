define(["underscore", "ext/three", "lib/grid_view"], function(_, THREE, GridView) {
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

    return {
      resize: function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      },
      camera: setup_camera(),
      scene: create_a_scene(),
      add_to_scene: function() { _.each(arguments, function(mesh) { this.scene.add(mesh); }.bind(this)); },
    }
  };
});
