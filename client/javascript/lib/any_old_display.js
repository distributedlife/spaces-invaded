define(["zepto", "lib/keyboard_controller", "lib/sound_manager2", "lodash", "lib/tracks_state_changes"], function($, KeyboardController, SoundManager, _, tracks_state_changes) {
	"use strict";

	return function(element, width, height, options) {
		var is_paused = function(state) { return state.paused; };
	    var player_count = function(state) { return state.players; };
	    var observer_count = function(state) { return state.observers; };
	    var game_dimensions = function(state) { return state.dimensions; };

		var client = {};
		_.extend(client, tracks_state_changes);
		_.extend(client, {
        	sound_manager: new SoundManager(),
        	width: width,
        	height: height,

        	animate: function() {},

			pause: function() { 
				$('.paused').show(); $('#paused').show();
				client.sound_manager.pauseAll();
			},
	        resume: function() { 
	        	$('.paused').hide(); $('#paused').hide(); 
	        	client.sound_manager.resumeAll();
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

	        setup_game: function() { console.log ("implement me"); },
	        update_game: function() { console.log ("implement me"); },

			setup: function(state) {
	            this.update_state(state);
	            this.setup_game();
	        },

	        resize: function(width, height) {
	        	this.width = width;
	        	this.height = height;
	        },

	        dimensions: function(width, height) {
	        	return {width: width, height: height};
	        },

	        update: function(state) {
	            this.update_state(state);

	            if (this.changed(game_dimensions)) { this.resize(this.width, this.height); }

	            if (this.changed(is_paused) && this.value(is_paused) === true) { this.pause(); }
	            if (this.changed(is_paused) && this.value(is_paused) === false) { this.resume(); }

	            if (this.changed(player_count)) {  $('#player-count').text(this.format_display_count(this.value(player_count)));  }
	            if (this.changed(observer_count)) {  $('#observer-count').text(this.format_display_count(this.value(observer_count)));  }

	            this.update_game();   
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

		return client;
	};
});