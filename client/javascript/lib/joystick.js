define(["lib/vector_math"], function(vector_math) {
	"use strict";

	return {
		point: function(e) {
            return {
                x: ~~ (e.layerX / e.target.clientWidth * 100),
                y: ~~ (e.layerY / e.target.clientHeight * 100)
            };
        },

		constrain: function(point) {
            if (point.x <= 33) { point.x = 0; }
            if (point.x > 33 && point.x <= 66) { point.x = 50; }
            if (point.x > 66) { point.x = 100; }

            if (point.y <= 33) { point.y = 0; }
            if (point.y > 33 && point.y <= 66) { point.y = 50; }
            if (point.y > 66) { point.y = 100; }

            return point;
        },

        centre_x: function(point) { point.x = 50; return point; },
        centre_y: function(point) { point.y = 50; return point; },

        snap_to_4: function(point) {
            var x_dist_a = Math.abs(point.x - 50);
            var y_dist_a = Math.abs(point.y - 50);

            if (x_dist_a < y_dist_a) {
              return centre_x(point);
            } else {
              return centre_y(point);
            }
        },

        snap_to_8: function(point) {
            var l_tl_br = vector_math.snapPointToLine(point, {x: 0, y: 0}, {x:100, y: 100});
            var l_l_r = vector_math.snapPointToLine(point, {x: 0, y: 50}, {x:100, y: 50});
            var l_t_b = vector_math.snapPointToLine(point, {x: 50, y: 0}, {x:50, y: 100});
            var l_bl_tr = vector_math.snapPointToLine(point, {x: 0, y: 100}, {x:100, y: 0});

            var ld_tl_br = vector_math.lineDistance(point, l_tl_br);
            var ld_l_r = vector_math.lineDistance(point, l_l_r);
            var ld_t_b = vector_math.lineDistance(point, l_t_b);
            var ld_bl_tr = vector_math.lineDistance(point, l_bl_tr);

            var array = [
              {d: ld_tl_br, p: l_tl_br},
              {d: ld_l_r, p: l_l_r},
              {d: ld_t_b, p: l_t_b},
              {d: ld_bl_tr, p: l_bl_tr}
            ];
            
            array = array.sort(function(a, b) { return a.d - b.d; });
                
            return array[0].p;
        },

        snap_to_circle: function(point) {
            var angle = Math.atan2(point.y - 50, point.x - 50);

            point.x = ((Math.cos(angle) * 50) + 50);
            point.y = ((Math.sin(angle) * 50) + 50);

            return point;
        }
	};
});