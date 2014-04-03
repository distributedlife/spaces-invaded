define(["ext/three"], function(THREE) {
  "use strict";

  return function(scene, camera) {
    return {
      renderer: new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }),
      resize: function(width, height) {
        this.renderer.setSize(width, height);
      },
      animate: function() {
        this.renderer.render(scene, camera);
      }
    };
  };
});
