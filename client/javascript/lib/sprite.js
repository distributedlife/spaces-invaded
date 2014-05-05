define(["ext/three", "lib/config"], function(THREE, config) {
  "use strict";
  
  var basicVertexShader = "void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }";
  var basicFragmentShader = "void main() { gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0); }";

  return function(model, texture_filename) {
    var geometry = new THREE.PlaneGeometry(model.width, model.height);
    var texture = THREE.ImageUtils.loadTexture(texture_filename);
    // var material = new THREE.ShaderMaterial({vertexShader: basicVertexShader, fragmentShader: basicFragmentShader});
    var material = new THREE.MeshBasicMaterial({map:texture, transparent: true, wireframe: config.wireframe});
    var mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -90;

    return {
      mesh: mesh,

      update_from_model: function(updated_model) {
        this.mesh.position.x = updated_model.x;
        this.mesh.position.y = updated_model.y;
        this.mesh.visible = updated_model.active;
      }
    }
  };
});
