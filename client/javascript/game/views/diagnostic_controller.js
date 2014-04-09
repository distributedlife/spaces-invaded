define(["socket.io", "lib/config", "zepto", "lodash", "lib/any_old_display", "lib/vector_math", "lib/joystick", "lib/window", "game/views/dedicated_controller"],
  function(io, config, $, _, AnyOldDisplay, vector_math, joystick, window, DedicatedController)
  {
    "use strict";

    return function(element, width, height, options) {
        var d = Object.create(AnyOldDisplay);
        d.keys = {
            "button0": 0,
            "button1": 0,
            "button2": 0,
            "button3": 0,
            "button4": 0,
            "button5": 0,
        };

        var press = function(control, button) { 
            $(control).addClass("pressed");
            d.keys[button] += 1;  
            $(control).text(d.keys[button]);
        };

        var release =  function(control, button) {  
            $(control).removeClass("pressed");
        };

        var as_vector = function(point) { return { x: (point.x * 2) - 1, y: (point.y * 2) - 1 }; } ;

        var apply_touch = function(control, area_name, point) { 
            $(control).css("background-image", "radial-gradient(at "+point.x+"% "+point.y+"%, #000, #FFF)"); 
            
            point.x /= 100;
            point.y /= 100;

            $("#x").text(as_vector(point).x);
            $("#y").text(as_vector(point).y);
        };
        var clear_touch = function(control, area_name) { 
            $(control).css("background-image", "");

            $("#x").text(0);
            $("#y").text(0); 
        };

        var configure_control = function(control, size, margin) {
            control.width(size).height(size);
            control.css('margin', margin+'px '+margin+'px');
        }

        var calculate_margin = function(size, height) {
            return (height - size) / 2;
        };

        var calculate_size = function(width, height) {
            var half_width = ~~ (width / 2);
            var frame = 32;

            if (height < half_width) {
                return height - frame - frame;
            } else {
                return half_width - frame - frame;
            }
        };

        var configure_controls = function() {
            var size = calculate_size($(window).width(), $(window).height())
            var half_size = size / 2;

            configure_control($('.left'), size, calculate_margin(size, $(window).height()));
            configure_control($('.right'), size, calculate_margin(size, $(window).height()));

            _.each(['.left', '.right'], function(area) {
                if ($(area).hasClass('joystick')) {
                    $(area).css('border-radius', half_size+'px');
                }
                if ($(area).hasClass('buttons')) {
                    size_buttons(size);
                    position_buttons(size);
                }
            })

            var w = $(window).width();
            var h = $(window).height()
            $("#w").text(w);
            $("#h").text(h);
        };

        var calculate_button_size = function(size) {
            var count = $('.button').length;

            if (count == 1) { return size; }
            if (count == 2) { return size * (9 / 16); }
            if (count == 3 || count == 4) { return size * (1 / 2); }
            if (count == 5) { return size * (6 / 16); }
            if (count == 6) { return size * (11 / 32); }
        };

        var size_buttons = function(size) {
            var count = $('.button').length;
            var button_size = calculate_button_size(size);
            var half_button_size = button_size / 2;

            for (var i = 0; i < count; i++) {
                $("#b"+i).width(button_size);
                $("#b"+i).height(button_size);
                $("#b"+i).css('border-radius', half_button_size+'px')
            }
        };

        var position_buttons = function(size) {
            var button_size = calculate_button_size(size);
            var count = $('.button').length;

            var left_edge = function(area_size, thing_size) { return 0 ; };
            var top_edge = left_edge;
            var right_edge = function(area_size, thing_size) { return area_size - thing_size; };
            var bottom_edge = right_edge;
            var middle = function(area_size, thing_size) { return (area_size / 2) - (thing_size / 2); };
            var fraction = function(area_size, thing_size, f) { return thing_size * f; };

            if (count == 2) { 
                $("#b0").css('left', left_edge(size, button_size));
                $("#b0").css('top', bottom_edge(size, button_size));

                $("#b1").css('left', right_edge(size, button_size));
                $("#b1").css('top', top_edge(size, button_size));
            }

            if (count == 3) { 
                $("#b0").css('left', left_edge(size, button_size));
                $("#b0").css('top', bottom_edge(size, button_size));

                $("#b1").css('left', middle(size, button_size));
                $("#b1").css('top', top_edge(size, button_size));

                $("#b2").css('left', right_edge(size, button_size));
                $("#b2").css('top', bottom_edge(size, button_size));
            }

            if (count == 4) { 
                $("#b0").css('left', left_edge(size, button_size));
                $("#b0").css('top', bottom_edge(size, button_size));

                $("#b1").css('left', left_edge(size, button_size));
                $("#b1").css('top', top_edge(size, button_size));

                $("#b2").css('left', right_edge(size, button_size));
                $("#b2").css('top', top_edge(size, button_size));

                $("#b3").css('left', right_edge(size, button_size));
                $("#b3").css('top', bottom_edge(size, button_size));
            }

            if (count == 5) { 
                $("#b0").css('left', fraction(size, button_size, 1 / 3));
                $("#b0").css('top', bottom_edge(size, button_size));

                $("#b1").css('left', left_edge(size, button_size));
                $("#b1").css('top', fraction(size, button_size, 4 / 6));

                $("#b2").css('left', middle(size, button_size));
                $("#b2").css('top', top_edge(size, button_size));

                $("#b3").css('left', right_edge(size, button_size));
                $("#b3").css('top', fraction(size, button_size, 4 / 6));

                $("#b4").css('left', fraction(size, button_size, 4 / 3));
                $("#b4").css('top', bottom_edge(size, button_size));
            }

            if (count == 6) { 
                $("#b0").css('left', fraction(size, button_size, 5 / 12));
                $("#b0").css('top', bottom_edge(size, button_size));

                $("#b1").css('left', left_edge(size, button_size));
                $("#b1").css('top', middle(size, button_size));

                $("#b2").css('left', fraction(size, button_size, 5 / 12));
                $("#b2").css('top', top_edge(size, button_size));

                $("#b3").css('left', fraction(size, button_size, 9 / 6));
                $("#b3").css('top', top_edge(size, button_size));

                $("#b4").css('left', right_edge(size, button_size));
                $("#b4").css('top', middle(size, button_size));

                $("#b5").css('left', fraction(size, button_size, 9 / 6));
                $("#b5").css('top', bottom_edge(size, button_size));
            }
        };

        var build_controls = function() {
            _.each(options.controls, function(control) {
                var area = null;
                var name = null;

                if (control.indexOf('left:') !== -1) {
                    area = $('.left');
                    name = control.split('left:')[1];
                }
                if (control.indexOf('right:') !== -1) {
                    area = $('.right');;
                    name = control.split('right:')[1];
                }
                    
                area.addClass(name);

                var size = calculate_size(width, height);
                var half_size = size / 2;
                if (name.indexOf('joystick') !== -1) {
                    area.addClass('joystick');
                    area.css('border-radius', half_size+'px')
                }
                if (name.indexOf('directional') !== -1) {
                    area.addClass('joystick');
                    area.css('border-radius', half_size+'px')
                }
                if (name.indexOf('buttons') !== -1) {
                    area.addClass('buttons');

                    var count = name.split('-')[1];
                    for (var i = 0; i < count; i++) {
                        area.append("<a id='b"+i+"' class='button' href='#'/>");
                    }
                }
            });

            configure_controls();
        };

        var side = function(element) {
            return element.hasClass("left") ? "left" : "right";
        };

        var bind_events = function() {
            var joystick_apply_events = ['mousedown', 'mousemove', 'touchstart', 'touchmove'];
            var button_apply_events = ['mousedown', 'touchstart'];
            var clear_events = ['mouseup',  'mouseleave', 'touchend', 'touchleave'];

            _.each(joystick_apply_events, function(apply_event) {
                $(".joystick-2-left-right").on(apply_event, function(e) {  apply_touch(this, side($(this)), joystick.centre_y(joystick.point(e))); e.preventDefault(); return false; });
                $(".joystick-2-up-down").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.centre_x(joystick.point(e))); e.preventDefault(); return false; });
                $(".joystick-4").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.snap_to_4(joystick.point(e))); e.preventDefault(); return false; });
                $(".joystick-8").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.snap_to_8(joystick.point(e))); e.preventDefault(); return false; });
                $(".joystick-N").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.point(e)); e.preventDefault(); return false; });
                $(".joystick-circle").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.snap_to_circle(joystick.point(e))); e.preventDefault(); return false; });

                $(".directional-8").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.constrain(joystick.snap_to_8(joystick.point(e)))); e.preventDefault(); return false; });
                $(".directional-4").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.constrain(joystick.snap_to_4(joystick.point(e)))); e.preventDefault(); return false; });
                $(".directional-2-left-right").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.constrain(centre_y(joystick.point(e)))); e.preventDefault(); return false; });
                $(".directional-2-up-down").on(apply_event, function(e) { apply_touch(this, side($(this)), joystick.constrain(joystick.centre_x(joystick.point(e)))); e.preventDefault(); return false; });
            });
            _.each(clear_events, function(clear_event) {
                $(".joystick-2-left-right").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
                $(".joystick-2-up-down").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
                $(".joystick-4").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
                $(".joystick-8").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
                $(".joystick-N").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });

                $(".directional-2-left-right").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
                $(".directional-2-up-down").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
                $(".directional-4").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
                $(".directional-8").on(clear_event, function(e) {  clear_touch(this, side($(this))); e.preventDefault(); return false; });
            });
            _.each(button_apply_events, function(apply_event) {
                $("#b0").on(apply_event, function(e) { press(this, 'button0'); e.preventDefault(); return false; });    
                $("#b1").on(apply_event, function(e) { press(this, 'button1'); e.preventDefault(); return false; });    
                $("#b2").on(apply_event, function(e) { press(this, 'button2'); e.preventDefault(); return false; });    
                $("#b3").on(apply_event, function(e) { press(this, 'button3'); e.preventDefault(); return false; });    
                $("#b4").on(apply_event, function(e) { press(this, 'button4'); e.preventDefault(); return false; });    
                $("#b5").on(apply_event, function(e) { press(this, 'button5'); e.preventDefault(); return false; });                  
            });
            _.each(clear_events, function(clear_event) {
                $("#b0").on(clear_event, function(e) { release(this, 'button0'); e.preventDefault(); return false; });    
                $("#b1").on(clear_event, function(e) { release(this, 'button1'); e.preventDefault(); return false; });    
                $("#b2").on(clear_event, function(e) { release(this, 'button2'); e.preventDefault(); return false; });    
                $("#b3").on(clear_event, function(e) { release(this, 'button3'); e.preventDefault(); return false; });    
                $("#b4").on(clear_event, function(e) { release(this, 'button4'); e.preventDefault(); return false; });    
                $("#b5").on(clear_event, function(e) { release(this, 'button5'); e.preventDefault(); return false; });    
            });    
        }

        var init = function() {
            build_controls();  
            $(window).on('resize', configure_controls);
        };

        init();
        bind_events();

        return d;
    };
});
