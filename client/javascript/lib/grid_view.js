define(["ext/three", "lib/config"], function(THREE, config) {
  "use strict";

  return function(width, height) {
    var build_grid = function() {
      var geometry = new THREE.Geometry();
      var vertical_lines = width / config.grid.size;
      var horizontal_lines = height / config.grid.size;

      for(var w = 1; w < vertical_lines; w++) {
        var x = w * config.grid.size;

        geometry.vertices.push(new THREE.Vector3(x, 0, 0), new THREE.Vector3(x, height, 0));
        geometry.colors.push(new THREE.Color(), new THREE.Color());
      }
      for (var h = 1; h < horizontal_lines; h++) {
        var y = h * config.grid.size;

        geometry.vertices.push(new THREE.Vector3(0, y, 0), new THREE.Vector3(width, y, 0));
        geometry.colors.push(new THREE.Color(), new THREE.Color());
      }

      var material = new THREE.LineBasicMaterial({ color: config.grid.colour});

      var line = new THREE.Line(geometry, material);
      line.visible = config.grid.enabled;
      line.type = THREE.LinePieces;

      return line;
    };

    return {
      grid: build_grid()
    };
  };
});
