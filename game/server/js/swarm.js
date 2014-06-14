"use strict";

var rek = require('rekuire');
var _ = require('underscore');
var team = rek('enums/teams');
var invader_types = rek('enums/invaders');
var bounding_box = rek('inch/private/js/bounding_box');

module.exports = function(invaders) {
	var min = function(array) { return Math.min.apply(Math, array); };
    var max = function(array) { return Math.max.apply(Math, array); };

    var active_invaders = function(invaders) { return _.filter(invaders, function(invader) { return invader.active; }); }
    var invader_left_x_positions = function(invaders) { return invaders.map(function(invader) { return invader.box().left(); }); };
    var invader_right_x_positions = function(invaders) { return invaders.map(function(invader) { return invader.box().right(); }); };

    var setup = {
    	columns: 10,
		row_pad: 40,
		row_margin: 24,
		column_pad: 60,
		column_margin: 33,
	    invade_drop: 10,
		invade_speedup: 1.075
    }

    var position_invader = function(invader, i, direction) {
		var row = Math.floor(i / setup.columns);
		var col = i % setup.columns;
		var x = col * setup.column_pad + setup.column_margin;
		var y = row * setup.row_pad + setup.row_margin;

		invader.spawn(x, y, direction);
	};

	var arrange = function(swarm) {
		var squids = _.where(invaders, {type: invader_types.squid});
		var bugs = _.where(invaders, {type: invader_types.bug});
		var skulls = _.where(invaders, {type: invader_types.skull});

		_.each(squids, function(invader, i) { position_invader(invader, i, swarm.direction); }.bind(swarm));
		_.each(bugs, function(invader, i) { position_invader(invader, i + squids.length, swarm.direction); }.bind(swarm));
		_.each(skulls, function(invader, i) { position_invader(invader, i + squids.length + bugs.length, swarm.direction); }.bind(swarm));

		return swarm;
	};

	var swarm = {
		name: "swarm",
		direction: 1,
		active: true,
		team: team.invaders,

		box: function() {
			var active = active_invaders(invaders);

			var min_x = min(invader_left_x_positions(active));
			var max_x = max(invader_right_x_positions(active));

			var width = max_x - min_x;

			return bounding_box(this, max_x - (width / 2.0), this.y, width, this.height); 
		},

		die: function() { this.active = false; },

		update: function(delta) {
			if (active_invaders.length === 0) {
				this.die();
			}

			_.each(invaders, function(invader) {
				var blocking = _.select(invaders, function(other_invader) { return other_invader.x === invader.x && other_invader.y > invader.y });
				if (blocking.length === 0) {
					invader.has_clear_shot = true;
				}
			});
		},

		reverse_direction: function() { this.direction *= -1; },

		invade: function() {
			_.each(invaders, function(invader) {  invader.invade(setup.invade_drop, setup.invade_speedup);  }.bind(this));

			this.reverse_direction();
		}
	};

	return arrange(swarm);
};