define(["lodash", "ext/three", "lib/grid_view", "lib/any_old_display", "lib/scene_renderer", "lib/window"], function(_, THREE, GridView, AnyOldDisplay, SceneRenderer, window) {
  "use strict";

  return function(element, width, height, options, setup_func, update_func, expired_effects_func) {
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

    var build_scene_renderer = function(scene, camera) {
      var scene_renderer = Object.create(SceneRenderer(scene, camera));
      scene_renderer.resize(width, height);
      window.get_element_by_id(element).appendChild(scene_renderer.renderer.domElement);

      return scene_renderer;
    };

    var display = Object.create(AnyOldDisplay(element, width, height, options, setup_func, update_func, expired_effects_func)) ;
    _.extend(display, {
      camera: setup_camera(),
      scene: create_a_scene(),
      things_in_scene: [],
      scene_renderer: build_scene_renderer(),

      dimensions: function(width, height) {
        if (this.current_state === null) {
          return {width: width, height: height};
        } else {
          return {
            width: width * width / this.current_state.dimensions.width, 
            height: height * height / this.current_state.dimensions.height
          };
        }
      },
      add_to_scene: function() { 
        _.each(arguments, function(mesh) { 
          display.scene.add(mesh); 
          display.things_in_scene.push(mesh);
        }.bind(display)); 
      },
      remove_from_scene: function() {
        _.each(arguments, function(mesh) { 
          display.scene.remove(mesh); 

          var i = display.things_in_scene.indexOf(mesh);
          display.things_in_scene.splice(i, 1);

        }.bind(display));
      },
      reset: function() {
        _.each(display.things_in_scene, function(thing_in_scene) {
          display.scene.remove(thing_in_scene);
        });

        display.things_in_scene = [];
      },
      animate: function(dt) {
        this.scene_renderer.animate(display.scene, display.camera); 
        if (this.setup_complete) {
          this.tick(dt); 
        }
      },
      resize: function(width, height) {
        display.__proto__.resize(width, height);
        display.scene_renderer.resize(this.dimensions(width, height).width, this.dimensions(width, height).height);

        display.camera.aspect = width / height;
        display.camera.updateProjectionMatrix();
      }
    });    

    return display;
  };
});
