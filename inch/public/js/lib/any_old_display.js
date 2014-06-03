define(["zepto", "lib/keyboard_controller", "lib/sound_manager2", "lodash", "lib/tracks_state_changes", "ext/screenfull", 'socket.io-client'], 
	function($, KeyboardController, SoundManager, _, tracks_state_changes, screenfull, io) {
	"use strict";

	return function(element, width, height, options, setup_func, update_func) {
		var is_paused = function(state) { return state.paused; };
	    var player_count = function(state) { return state.players; };
	    var observer_count = function(state) { return state.observers; };
	    var game_dimensions = function(state) { return state.dimensions; };

		var display = {};
		_.extend(display, tracks_state_changes);
		_.extend(display, {
        	sound_manager: new SoundManager(),
        	width: width,
        	height: height,
        	setup_complete: false,
        	prior_step: Date.now(),
        	temporary_effects: [],
        	permanent_effects: [],
        	changes: [],

        	update_display: function() {
        		if (this.value(is_paused) === true) {
        			this.prior_step = Date.now();
        			return;
        		}

        		var now = Date.now();
        		//TODO: config.global_time_dilation should apply to effects;
      			var dt = (now - this.prior_step) / 1000 * 1.0;
      			this.prior_step = Date.now();

        		this.animate(dt);
        	},
        	animate: function(dt) { 
        		if (this.setup_complete) {
        			this.tick(dt); 
        		}
        	},
	        tick: function(dt) {
                _.each(this.permanent_effects, function(permanent_effect) { permanent_effect.tick(dt); });
                _.each(this.temporary_effects, function(temporary_effect) { temporary_effect.tick(dt); });

                var expired_effects = _.select(this.temporary_effects, function(temporary_effect) { !temporary_effect.is_alive(); });
                this.temporary_effects = _.reject(this.temporary_effects, function(temporary_effect) { !temporary_effect.is_alive(); });

                this.expired_effects_func(expired_effects);
            },
            expired_effects_func: function(expired_effects) {},

			pause: function() { 
				$('.paused').show(); $('#paused').show();
				display.sound_manager.pauseAll();
			},
	        resume: function() { 
	        	$('.paused').hide(); $('#paused').hide(); 
	        	display.sound_manager.resumeAll();
	        },

	        disconnected: function() { $('.disconnected').show(); },
	        connected: function() { $('.disconnected').hide(); },

	        format_display_count: function(count) {
	            if (count < 1000) {
	                return count;
	            } else if (count < 10000) {
	                return (~~(count / 1000))+"K+";
	            } else {
	                return "9K+";
	            }
	        },

	        reset: function() {},

			setup: function(state) {
				this.reset();
	            this.update_state(state);
	            setup_func();

	            if (this.value(is_paused) === true) {
	            	display.sound_manager.pauseAll();
	            }

	            this.setup_complete = true;
	        },

	        resize: function(width, height) {
	        	this.width = width;
	        	this.height = height;
	        },

	        dimensions: function(width, height) {
	        	return {width: width, height: height};
	        },


	        //TODO: move this to something that is made out of 'tracks state changes' and 'provides automatic change notification'
            on_change: function(model, callback) {
            	this.changes.push({
            		focus: model, 
            		func: callback
            	});
	        },
	        on_conditional_change: function(model, condition, callback) {
	            this.changes.push({
	            	focus: model, 
	            	'when': condition, 
	            	func: callback
	            });
	        },
	        on_element_change: function(model_array, model_element, callback) {
	            this.changes.push({
	            	focus_each_of: model_array, 
	            	focus_element: model_element, 
	            	func: callback
	            });
	        },
	        handle_arrays: function(change) {
	        	var counter = 0;
                _.each(this.value(change.focus_each_of), function(model) {
                    if (this.element_changed(change.focus_element, counter)) {
                        change.func(model, this.prior_element(change.focus_element, counter));
                    }
                    counter++;
                }.bind(this)); 
	        },
	        handle_objects: function(change) {
	        	if (this.changed(change.focus)) {
                    if (change.when === undefined) {
                        change.func(this.value(change.focus), this.prior_value(change.focus));
                    } else {
                        if (change.when(this.value(change.focus))) {
                            change.func(this.value(change.focus), this.prior_value(change.focus));
                        }
                    }
                }
	        },
	        detect_changes_and_notify_observers: function() {
	        	_.each(this.changes, function(change) {
	                if (change.focus === undefined) {
	                    this.handle_arrays(change);
	                } else {
	                 	this.handle_objects(change);   
	                }
	            }.bind(this));
	        },


	        update: function(state) {
	            this.update_state(state);

	            if (this.changed(game_dimensions)) { this.resize(this.width, this.height); }

	            if (this.changed(is_paused) && this.value(is_paused) === true) { this.pause(); }
	            if (this.changed(is_paused) && this.value(is_paused) === false) { this.resume(); }

	            if (this.changed(player_count)) {  $('#player-count').text(this.format_display_count(this.value(player_count)));  }
	            if (this.changed(observer_count)) {  $('#observer-count').text(this.format_display_count(this.value(observer_count)));  }

	            this.detect_changes_and_notify_observers();
	            update_func();
	        }, 

	        connect_to_server: function() {
	            var socket = io.connect('/desktop');

	            if (window.document.hasFocus() && !options.observer) { socket.emit('unpause'); }
	            
	            socket.on('disconnect', this.disconnected);
	            socket.on('connect', this.connected);
	            socket.on('game_state/setup', this.setup.bind(this));
	            socket.on('game_state/update', this.update.bind(this));
	            socket.on('error', function(data) { throw Error(data); });

	            if (!options.controls.indexOf("keyboard") !== -1) {
	                KeyboardController(socket, element);
	            }
	        }
	    });

		$(".fullscreen").on('click', function() { if (screenfull.enabled) { screenfull.toggle(); } });
		$(".sound-off").hide();
		$(".sound-on").on('click', function() {
			$(".sound-on").hide();
			$(".sound-off").show();

			display.sound_manager.mute();			
		});
		$(".sound-off").on('click', function() {
			$(".sound-off").hide();
			$(".sound-on").show();

			display.sound_manager.unmute();			
		});

		return display;
	};
});