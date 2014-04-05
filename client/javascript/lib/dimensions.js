define(["lib/window"], function(window) {
	"use strict";

	return function(ratio) {
        var width, height;
        var ratio = ratio;
        var ratioHeight = ~~ (window.innerWidth / ratio);
        var ratioWidth = ~~ (window.innerHeight * ratio);

        if (ratioHeight > window.innerHeight) {
            width = ratioWidth;
            height = window.innerHeight;
        } else {
            height = ratioHeight;
            width = window.innerWidth;
        }

        var margin = ~~(window.innerHeight - height)/2;

        return {width: width, height: height, margin: margin};
    };
});