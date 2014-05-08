define(["ext/three", "lib/config",  "shader!vertex/basic.glsl", "shader!fragment/decal.glsl"], function(THREE, config, vShader, fShader) {
  "use strict";
  
  return function(model, texture_filename) {
    var geometry = new THREE.PlaneGeometry(model.width, model.height);
    var decal = THREE.ImageUtils.loadTexture(texture_filename);
    
    var material = new THREE.ShaderMaterial({ 
      uniforms: {
        decal: {type: 't', value: decal}
      },
      vertexShader: vShader.value, 
      fragmentShader: fShader.value, transparent: true 
    });
    
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
