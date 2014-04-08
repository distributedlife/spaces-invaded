define(["lib/window", "lodash"], function(window, _) {
    "use strict";

    return function(socket, element, width, height) {
        var controller = {
            last_sent: {},
            input_data: {
                x: 0,
                y: 0,
                touches: [],
                keys: []
            },

            keys: {},

            key_map: function() {
                var map = {
                    '9': 'tab',
                    '17': 'control',
                    '18': 'alt',
                    '27': 'escape',
                    '32': 'space',
                    '37': 'left',
                    '38': 'up',
                    '39': 'right',
                    '40': 'down'
                };

                for(var i = 48; i <= 90; i++) {
                    if (i > 57 && i < 65) { continue ;}
                    if (map[i] !== undefined) {
                        continue;
                    }
                    map[i] = String.fromCharCode(i);
                } 

                return map;
            },
            mouse_map: function() {
                return {
                    '1': 'button1',
                    '3': 'button2'
                };
            },
            
            press: function(key) { 
                this.keys[key] = true; 
            },
            
            release: function(key) { 
                this.keys[key] = false; 
            },

            handleClickOrTouch: function(func, value, e) {
                func(value); 
                e.preventDefault();
                e.stopPropagation();
            },

            detectButtonsMappingToKeys: function() {
                _.each(this.key_map(), function(value, key) {
                    var classname = ".button.key-"+value;
                    if ('ontouchstart' in window) {
                        $(classname).on('touchstart', function(e) { this.handleClickOrTouch(this.press.bind(this), value, e); }.bind(this));
                        $(classname).on('touchend', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                        $(classname).on('touchcancel', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                        $(classname).on('touchleave', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                    } else {
                        $(classname).on('mousedown', function(e) { this.handleClickOrTouch(this.press.bind(this), value, e); }.bind(this));
                        $(classname).on('mouseup', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                        $(classname).on('mouseleave', function(e) { this.handleClickOrTouch(this.release.bind(this), value, e); }.bind(this));
                    }
                }.bind(this));
            },

            bindToWindowEvents: function() {
                $(window).on('mousedown', function(e) {
                    this.press(this.mouse_map()[e.which]);
                    e.preventDefault();
                }.bind(this));

                $(window).on('mouseup', function(e) {
                    this.release(this.mouse_map()[e.which]);
                    e.preventDefault();
                }.bind(this));

                $(window).on('mouseleave', function(e) {
                    this.release(this.mouse_map()[e.which]);
                    e.preventDefault();
                }.bind(this));

                $("#"+element).on('mousemove', function(e) {
                    this.input_data.x = e.layerX;
                    this.input_data.y = e.layerY;
                }.bind(this));

                $("#"+element).on('touchstart', function(e) {
                    _.each(e.touches, function(touch) {
                        var x = touch.clientX - touch.target.offsetLeft;
                        var y = touch.clientY - touch.target.offsetTop;
                        this.input_data.touches.push({ id: touch.identifier, x: x, y: y, force: touch.webkitForce || 1 });
                    }.bind(this));
                }.bind(this));

                $("#"+element).on('touchmove', function(e) {
                    _.each(e.touches, function(touch) {
                        var x = touch.clientX - touch.target.offsetLeft;
                        var y = touch.clientY - touch.target.offsetTop;
                        this.input_data.touches.push({ id: touch.identifier, x: x, y: y, force: touch.webkitForce || 1 });
                    }.bind(this));
                }.bind(this));

                $("#"+element).on('touchend', function(e) {
                    var ids = _.map(e.changedTouches, function(touch) { return touch.identifier; }) ;
                    this.input_data.touches = _.reject(this.input_data.touches, function(touch) { return ids.indexOf(touch.id) !== -1});
                }.bind(this));

                $("#"+element).on('touchleave', function(e) {
                    var ids = _.map(e.changedTouches, function(touch) { return touch.identifier; }) ;
                    this.input_data.touches = _.reject(this.input_data.touches, function(touch) { return ids.indexOf(touch.id) !== -1});
                }.bind(this));

                $("#"+element).on('touchcancel', function(e) {
                    var ids = _.map(e.changedTouches, function(touch) { return touch.identifier; }) ;
                    this.input_data.touches = _.reject(this.input_data.touches, function(touch) { return ids.indexOf(touch.id) !== -1});
                }.bind(this));

                $(window.document).keydown(function(e) {
                    if (e.metaKey) { return; }

                    this.press(this.key_map()[e.which]);
                    e.preventDefault();
                }.bind(this));

                $(window.document).keyup(function(e) {
                    this.release(this.key_map()[e.which]);
                }.bind(this));

                $(window).on('blur', function() { socket.emit('pause'); }.bind(this));
                $(window).on('focus', function() { socket.emit('unpause'); }.bind(this));
            },

            emit: function() {
                var keys_to_send = [];
                _.each(this.keys, function(value, key) {
                    if (value) { 
                        keys_to_send.push(key); 
                    }
                });
                this.input_data.keys = keys_to_send;
                
                if (_.isEqual(this.input_data, this.last_sent)) {
                    return;
                }

                socket.emit('input', this.input_data);
                this.last_sent = _.clone(this.input_data, true);
            },
            notifyServerOfInput: function() { setInterval(this.emit.bind(this), 1000 / 60); }
        };

        controller.detectButtonsMappingToKeys();
        controller.bindToWindowEvents();
        controller.notifyServerOfInput();

        return controller;
    };
});