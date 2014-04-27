define(["zepto", "lib/keyboard_controller"], function($, KeyboardController) {
	"use strict";

	return function(element, width, height, options) {
		var is_paused = function(state) { return state.paused; };
	    var player_count = function(state) { return state.players; };
	    var observer_count = function(state) { return state.observers; };

		return {
	        prior_state: null,
	        current_state: null,

	        changed: function(f) { 
	        	if (this.prior_state === null) { return true; }

	        	return f(this.prior_state) !== f(this.current_state); 
	        },
	        element_changed: function(f, i) { 
	        	if (this.prior_state === null) { return true; }

	        	return f(this.prior_state, i) !== f(this.current_state, i); 
	        },
	        value: function(f) {  return f(this.current_state);  },
	        element_value: function(f, i) { return f(this.current_state, i); },

			pause: function() { $('.paused').show(); $('#paused').show();},
	        resume: function() { $('.paused').hide(); $('#paused').hide(); },

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

	        setup_game: function() { console.log ("implement me"); },
	        update_game: function() { console.log ("implement me"); },

			setup: function(state) {
	            this.prior_state = this.current_state;
	            this.current_state = state;

	            this.setup_game();
	        },

	        update: function(state) {
	            this.prior_state = this.current_state;
	            this.current_state = state;

	            if (this.changed(is_paused) && this.value(is_paused) === true) { this.pause(); }
	            if (this.changed(is_paused) && this.value(is_paused) === false) { this.resume(); }

	            if (this.changed(player_count)) {  $('#player-count').text(this.format_display_count(this.value(player_count)));  }
	            if (this.changed(observer_count)) {  $('#observer-count').text(this.format_display_count(this.value(observer_count)));  }

	            this.update_game();   
	        }, 

	        connect_to_server: function() {
	            var socket = io.connect('/desktop');
	            socket.emit('resize', { width: width, height: height });

	            if (window.document.hasFocus() && !options.observer) { socket.emit('unpause'); }
	            
	            socket.on('disconnect', this.disconnected);
	            socket.on('connect', this.connected);
	            socket.on('game_state/setup', this.setup.bind(this));
	            socket.on('game_state/update', this.update.bind(this));
	            socket.on('error', function(data) { throw Error(data); });

	            if (!options.controls.indexOf("keyboard") !== -1) {
	                KeyboardController(socket, element, width, height);
	            }
	        }
	    };
	};
});