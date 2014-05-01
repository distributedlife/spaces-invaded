"use strict";

var _ = require('underscore');
var bounding_box = require('../lib/bounding_box');
var team = require('./enums/teams');
var invader_types = require('./enums/invaders');

module.exports = function(invaders) {
	var min = function(array) { return Math.min.apply(Math, array); };
    var max = function(array) { return Math.max.apply(Math, array); };

    var active_invaders = function(invaders) { return _.filter(invaders, function(invader) { return invader.active; }); }
    var invader_left_x_positions = function(invaders) { return invaders.map(function(invader) { return invader.box().left(); }); };
    var invader_right_x_positions = function(invaders) { return invaders.map(function(invader) { return invader.box().right(); }); };

	var swarm = {
		name: "swarm",
		direction: 1,
		active: true,
		team: team.invaders,
		cols: 10,
		row_pad: 40,
		row_margin: 24,
		col_pad: 60,
		col_margin: 33,
		left_extent: 0,
		right_extent: 500,

		box: function() {
			var active = active_invaders(invaders);

			var min_x = min(invader_left_x_positions(active));
			var max_x = max(invader_right_x_positions(active));

			var width = max_x - min_x;

			return bounding_box(max_x - (width / 2), this.y, width, this.height); 
		},

		die: function() { this.active = false; },

		update: function(delta) {
			if (active_invaders.length === 0) {
				this.die();
			}
		},

		position_invader: function(invader, i) {
			var row = Math.floor(i / this.cols);
			var col = i % this.cols;
			var x = col * this.col_pad + this.col_margin;
			var y = row * this.row_pad + this.row_margin;

			invader.spawn(x, y, this.direction);
    	},

		arrange: function() {
			var squids = _.where(invaders, {type: invader_types.squid});
			var bugs = _.where(invaders, {type: invader_types.bug});
			var skulls = _.where(invaders, {type: invader_types.skull});

			_.each(squids, function(invader, i) { this.position_invader(invader, i); }.bind(this));
			_.each(bugs, function(invader, i) { this.position_invader(invader, i + squids.length); }.bind(this));
			_.each(skulls, function(invader, i) { this.position_invader(invader, i + squids.length + bugs.length); }.bind(this));
		},

		reverse_direction: function() { this.direction *= -1; },

		invade: function() {
			_.each(invaders, function(invader) {  invader.invade();  });

			this.reverse_direction();
		}
	};

	swarm.arrange();

	return swarm;
};