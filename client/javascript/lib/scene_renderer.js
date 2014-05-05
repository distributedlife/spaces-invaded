define(["ext/three"], function(THREE) {
  "use strict";

  return function() {
    return {
      renderer: new THREE.WebGLRenderer({ antialias: true }),
      resize: function(width, height) { this.renderer.setSize(width, height); },
      animate: function(scene, camera) { this.renderer.render(scene, camera); }
    };
  };
});