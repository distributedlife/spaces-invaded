define(["ext/three"], function(THREE) {
  "use strict";
  
  return function(model, texture_filename) {
    var geometry = new THREE.PlaneGeometry(model.width, model.height);
    var material = new THREE.MeshBasicMaterial({ 
      map: THREE.ImageUtils.loadTexture(texture_filename),
      transparent: true,
      alphaTest: 0.1,
      blending: THREE.AdditiveBlending
    });
    
    var mesh = new THREE.Mesh(geometry, material)
    mesh.position.x = model.x;
    mesh.position.y = model.y;
    mesh.position.z = model.z || 0;
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
