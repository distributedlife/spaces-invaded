"use strict";

var _ = require('underscore');
var bounding_box = require('../lib/bounding_box');
var team = require('./enums/teams');
var invader_types = require('./enums/invaders');

module.exports = function(invaders) {
	var min = function(array) { return Math.min.apply(Math, array); };

    var max = function(array) { return Math.max.apply(Math, array); };

    var active_invaders = function(invaders) { return _.filter(invaders, function(invader) { return invader.active; }); }
    var invader_left_x_positions = function(invaders) { return invaders.map(function(invader) { return invader.box.left(); }); };
    var invader_right_x_positions = function(invaders) { return invaders.map(function(invader) { return invader.box.right(); }); };

    var collect_invaders_by_type = function(invaders, type) { return _.where(invaders, {type: type}); };

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
			var min_x = min(collect_invader_left_x_positions(active_invaders(invaders)));
			var max_x = max(collect_invader_right_x_positions(active_invaders(invaders)));

			return bounding_box(min_x, this.y, max_x, this.height); 
		},

		die: function() { this.active = false; },

		update: function(delta) {
			if (active_invaders.length === 0) {
				this.die();
				return;
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
		}
	};

	swarm.arrange();

	return swarm;
};

//   return function(invaders, swarm_config) {
  

//     _this.is_heading = function(direction) {
//       return (_this.direction === direction);
//     };

//     _this.reverse_direction = function() {
//       _this.direction = (_this.direction === enums.Directions.Right) ? enums.Directions.Left : enums.Directions.Right;
//     };

//     _this.is_hitting_left_edge = function() {
//       return (_this.is_heading(enums.Directions.Left) && (_this.box.left() <= swarm_config.left_extent));
//     };

//     _this.is_hitting_right_edge = function() {
//       return (_this.is_heading(enums.Directions.Right) && (_this.box.right() >= swarm_config.right_extent));
//     };

//     _this.calculate_overlap_with_view_edge = function() {
//       if (_this.is_heading(enums.Directions.Right)) {
//         return _this.box.right() - swarm_config.right_extent;
//       }
//       if (_this.is_heading(enums.Directions.Left)) {
//         return _this.box.left() + swarm_config.left_extent;
//       }
//     };

//     _this.update = function(delta) {
//       if(_this.is_hitting_right_edge() || _this.is_hitting_left_edge()) {
//         var overlap = _this.calculate_overlap_with_view_edge();
//         _this.invade(overlap);
//       }
//     };

//     _this.invade = function(amount_to_shift) {
//       invaders.forEach(function(invader) {
//         invader.invade();
//         invader.shift(amount_to_shift, 0, 0);
//       });

//       _this.reverse_direction();
//     };
//   };
