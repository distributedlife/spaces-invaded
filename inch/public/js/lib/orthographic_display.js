define(["lodash", "ext/three", "ext/three/EffectComposer",  "ext/three/passes/RenderPass", "ext/three/shaders/HorizontalBlurShader", "lib/grid_view", "lib/any_old_display", "lib/window"], 
  function(_, THREE, EffectComposer, RenderPass, HorizontalBlurShader, GridView, AnyOldDisplay, window) {
  "use strict";

  return function(element, width, height, options, setup_func, update_func) {
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
      var renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      window.get_element_by_id(element).appendChild(renderer.domElement);

      return renderer;
    };

    var build_composer = function(scene, camera, renderer) {
      // var composer = new THREE.EffectComposer(renderer);
      
      // var firstpass = new THREE.RenderPass(scene, camera)
      // hblur.renderToScreen = true;
      // composer.addPass(firstpass);
      // var hblur = new THREE.ShaderPass(THREE.HorizontalBlurShader)
      // var secondpass = new THREE.BloomPass(0.75);
      // secondpass.renderToScreen = true;
      // composer.addPass(hblur);

      // composer.addPass(secondpass);

      // return composer;
    };

    var camera = setup_camera();
    var scene = create_a_scene();
    var renderer = build_scene_renderer(scene, camera);
    var composer = build_composer(scene, camera, renderer)

    var display = Object.create(AnyOldDisplay(element, width, height, options, setup_func, update_func)) ;
    _.extend(display, {
      camera: camera,
      scene: scene,
      things_in_scene: [],
      renderer: renderer,
      composer: composer,

      expired_effects_func: function(expired_effects) {
        _.each(expired_effects, function(expired_effect) {  this.remove_from_scene(expired_effect.mesh); });
      },

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
        this.renderer.render(display.scene, display.camera); 
        // this.renderer.clear();
        // this.composer.render();
        if (this.setup_complete) {
          this.tick(dt); 
        }
      },
      resize: function(width, height) {
        display.__proto__.resize(width, height);
        display.renderer.setSize(this.dimensions(width, height).width, this.dimensions(width, height).height);

        display.camera.aspect = width / height;
        display.camera.updateProjectionMatrix();
      }
    });    

    return display;
  };
});
