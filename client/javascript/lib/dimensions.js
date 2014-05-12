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

            var pos = 0;
            //TODO: this positional stuff should go elsewhere
            $(".fullscreen").css("top", position(pos++)-icon_top()+"px").css("right", "0"); 
            $(".disconnected").css("top", position(pos++)-icon_top()+"px").css("right", "0");
            $(".paused").css("top", position(pos++)-icon_top()+"px").css("right", "0");
            $(".players").css("top", position(pos++)-icon_top()+"px").css("right", "0");
            $(".player-count").css("top", position(pos++)-text_top()+"px").css("right", "0");
            $(".observers").css("top", position(pos++)-icon_top()+"px").css("right", "0");
            $(".observer-count").css("top", position(pos++)-text_top()+"px").css("right", "0");
        } else {
            if (ratioHeight + min_margin + min_margin > window.innerHeight) {
                width = ratioWidth;
                height = window.innerHeight - min_margin - min_margin;
            } else {            
                height = ratioHeight;
                width = window.innerWidth;
            }

            var pos = 0;
            //TODO: this positional stuff should go elsewhere
            $(".fullscreen").css("right", position(pos++)+"px").css("top", icon_top()+"px");
            $(".disconnected").css("right", position(pos++)+"px").css("top", icon_top()+"px");
            $(".paused").css("right", position(pos++)+"px").css("top", icon_top()+"px");
            $(".players").css("right", position(pos++)+"px").css("top", icon_top()+"px");
            $(".player-count").css("right", position(pos++)+"px").css("top", text_top()+"px");
            $(".observers").css("right", position(pos++)+"px").css("top", icon_top()+"px");
            $(".observer-count").css("right", position(pos++)+"px").css("top", text_top()+"px");
        }

        var margin = ~~(window.innerHeight - height)/2;

        return {width: width, height: height, margin: margin};
    };
});