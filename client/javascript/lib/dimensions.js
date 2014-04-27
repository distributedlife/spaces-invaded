define(["lib/window"], function(window) {
	"use strict";
    
    var min_margin = 32;
    var icon_size = 32;
    var position = function(slot) { return slot * icon_size; };
    var icon_top = function() { return 0; };
    var text_top = function() { return +6; };

    return function(ratio) {
        var width, height;
        var ratio = ratio;
        var ratioHeight = ~~ (window.innerWidth / ratio);
        var ratioWidth = ~~ (window.innerHeight * ratio);
        
        if (ratioHeight > window.innerHeight) {
            if (ratioWidth + min_margin + min_margin > window.innerWidth) {
                width = window.innerWidth - min_margin - min_margin;
                height = ratioHeight;
            } else {            
                width = ratioWidth;
                height = window.innerHeight;
            }

            $(".paused").css("top", position(1)-icon_top()+"px").css("right", "0");
            $(".players").css("top", position(2)-icon_top()+"px").css("right", "0");
            $(".player-count").css("top", position(3)-text_top()+"px").css("right", "0");
            $(".observers").css("top", position(4)-icon_top()+"px").css("right", "0");
            $(".observer-count").css("top", position(5)-text_top()+"px").css("right", "0");
        } else {
            if (ratioHeight + min_margin + min_margin > window.innerHeight) {
                width = ratioWidth;
                height = window.innerHeight - min_margin - min_margin;
            } else {            
                height = ratioHeight;
                width = window.innerWidth;
            }

            $(".paused").css("right", position(1)+"px").css("top", icon_top()+"px");
            $(".players").css("right", position(2)+"px").css("top", icon_top()+"px");
            $(".player-count").css("right", position(3)+"px").css("top", text_top()+"px");
            $(".observers").css("right", position(4)+"px").css("top", icon_top()+"px");
            $(".observer-count").css("right", position(5)+"px").css("top", text_top()+"px");
        }

        var margin = ~~(window.innerHeight - height)/2;

        return {width: width, height: height, margin: margin};
    };
});