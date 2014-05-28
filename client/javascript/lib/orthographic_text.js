define(["ext/three", "lib/temporary_effect", "shader!vertex/scale.glsl", "shader!fragment/colour.glsl"], 
  function(THREE, temporary_effect, vertexShader, fragmentShader) {
  "use strict";

  return function(initialText, display_options) {
    _.defaults(display_options, {
      alignment: {
        horizontal: "centre",
        vertical: "centre"
      },
      duration: 0,
      scale: {
        from: 1.0,
        to: 1.0
      },
      colour: {
        from: [1.0, 1.0, 1.0, 1.0],
        to: [1.0, 1.0, 1.0, 0.0]
      },
      position: {x: 0, y: 0, z: 0}
    });

    var createMeshFromText = function(textToDisplay) {
      var shape = THREE.FontUtils.generateShapes(textToDisplay, display_options);
      
      var geometry = new THREE.ShapeGeometry(shape);
      geometry.computeBoundingBox();

      var material = new THREE.ShaderMaterial({
        uniforms: {
          from_scale: {type: "f", value: display_options.scale.from},
          to_scale: {type: "f", value: display_options.scale.to},
          from_colour: {type:"v4", value: new THREE.Vector4(display_options.colour.from[0], display_options.colour.from[1], display_options.colour.from[2], display_options.colour.from[3])},
          to_colour: {type:"v4", value: new THREE.Vector4(display_options.colour.to[0], display_options.colour.to[1], display_options.colour.to[2], display_options.colour.to[3])},
          progress: {type: "f", value: 0.0},
        },
        vertexShader: vertexShader.value, 
        fragmentShader: fragmentShader.value, 
        transparent: true,
        blending: THREE.AdditiveBlending
      });
      
      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -90; 

      return mesh; 
    };

    var orthographic_text = {
      mesh: createMeshFromText(initialText),
      position: display_options.position,
      text: initialText,

      width: function() { return this.mesh.geometry.boundingBox.max.x - this.mesh.geometry.boundingBox.min.x; },
      height: function() { return this.mesh.geometry.boundingBox.max.y - this.mesh.geometry.boundingBox.min.y; },

      align_position: function(position) {
        var aligned_position = {x: 0, y: 0, z: 0};

        if (display_options.alignment.horizontal === "left") {
          aligned_position.x = position.x;
        } else if (display_options.alignment.horizontal === "right") {
          aligned_position.x = position.x - this.width();
        } else {
          aligned_position.x = position.x - (this.width() / 2);
        }

        if (display_options.alignment.horizontal === "top") {
          aligned_position.y = position.y;
        } else if (display_options.alignment.horizontal === "bottom") {
          aligned_position.y = position.y + this.height();
        } else {
          aligned_position.y = position.y + (this.height() / 2);
        }

        return aligned_position;
      },

      update_from_model: function(updated_model) {
        this.position = {x: updated_model.x, y: updated_model.y, z: 0};
        this.mesh.position = this.align_position(this.position);
        this.mesh.visible = updated_model.active || true;
      },

      update_colour: function(from, to) { 
        this.mesh.material.uniforms.from_colour = {type: "v4", value: from}
        this.mesh.material.uniforms.to_colour = {type: "v4", value: to}
        this.mesh.material.needsUpdate = true;
      },

      update_text: function(updatedText, scene) {
        this.text = updatedText;

        var is_visible = this.mesh.visible;

        scene.remove(this.mesh);

        this.mesh = createMeshFromText(updatedText);
        this.mesh.position = this.align_position(this.position);
        this.mesh.visible = is_visible;

        scene.add(this.mesh);
      },

      on_tick: function(dt) {
        if (!this.is_alive()) {
          this.mesh.visible = false;
        }

        this.mesh.material.uniforms.progress = {type: "f", value: this.progress()};
        this.mesh.material.needsUpdate = true;
      }
    };
    _.extend(orthographic_text, temporary_effect(display_options.duration, orthographic_text.on_tick.bind(orthographic_text)));

    return orthographic_text;
  }
});
