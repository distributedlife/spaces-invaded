define(["ext/three", "shader!vertex/basic.glsl", "shader!fragment/colour.glsl"], function(THREE, vertexShader, fragmentShader) {
  "use strict";

  return function(originalText, halign, valign, font) {
    var createMesh = function(textToDisplay) {
      var shape = THREE.FontUtils.generateShapes(textToDisplay, font || {});
      
      var geometry = new THREE.ShapeGeometry(shape);
      geometry.computeBoundingBox();

      var material = new THREE.ShaderMaterial({ 
        uniforms: {
           suppliedColour: {type:"v4", value: new THREE.Vector4(1.0,1.0,1.0,1.0)}
        },
        vertexShader: vertexShader.value, 
        fragmentShader: fragmentShader.value, transparent: true 
      });
      
      var mesh = new THREE.Mesh(geometry, material);
      mesh.rotation.x = -90; 

      return mesh; 
    };

    return {
      mesh: createMesh(originalText),
      position: {},

      width: function() { return this.mesh.geometry.boundingBox.max.x - this.mesh.geometry.boundingBox.min.x; },
      height: function() { return this.mesh.geometry.boundingBox.max.y - this.mesh.geometry.boundingBox.min.y; },

      align_position: function(position) {
        var aligned_position = {x: 0, y: 0, z: 0};

        if (halign === "left") {
          aligned_position.x = position.x;
        } else if (halign === "right") {
          aligned_position.x = position.x - this.width();
        } else {
          aligned_position.x = position.x - (this.width() / 2);
        }

        if (valign === "bottom") {
          aligned_position.y = position.y;
        } else if (valign === "top") {
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

      update_text: function(updatedText, scene) {
        var is_visible = this.mesh.visible;

        scene.remove(this.mesh);

        this.mesh = createMesh(updatedText);
        this.mesh.position = this.align_position(this.position);
        this.mesh.visible = is_visible;

        scene.add(this.mesh);
      }
    };
  }
});
