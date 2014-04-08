define([], function() {
	"use strict";

	return {
        lineDistance: function(p1, p2) {
            var xs = 0;
            var ys = 0;
           
            xs = p2.x - p1.x;
            xs = xs * xs;
           
            ys = p2.y - p1.y;
            ys = ys * ys;
           
            return Math.sqrt(xs + ys);
        },

        snapPointToLine: function (p, a, b) {
            var ap1 = p.x-a.x,
              ap2 = p.y-a.y,
              ab1 = b.x-a.x,
              ab2 = b.y-a.y,
              mag = ab1*ab1 + ab2*ab2,
              dot = ap1*ab1 + ap2*ab2,
              t = dot/mag;

            if (t < 0) {
              return {x: a.x, y: a.y};
            } else if (t > 1) {
              return {x: b.x, y: b.y};
            } else {
              return {x: a.x+ab1*t, y: a.y+ab2*t};
            }
        }
	}
});