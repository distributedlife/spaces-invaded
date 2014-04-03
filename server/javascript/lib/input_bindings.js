var watchjs = require("watchjs");
var _ = require('underscore');

module.exports = function(game_state, user_input, action_map) {
	var input_bindings = {
		parse_keys_and_buttons: function(callback) {
			_.each(user_input.raw_data.keys, function(key) {
				if (action_map[key] === undefined) { return; }

				_.each(action_map[key], function(action) { 
					callback(action.target, action.func);
				});
			});
		},
		map_input_to_action: function() {
			this.parse_keys_and_buttons(function(target, func) {
				game_state[target][func](1.0);
			})

			if (action_map['cursor'] !== undefined) {
				_.each(action_map['cursor'], function(action) {
					var target = action.target;
					var func = action.func;

					var cx = user_input.raw_data.x;
					var cy = user_input.raw_data.y;
					game_state[target][action](cx, cy);
				});
			}
		},
		handle_no_input: function() {
			if (action_map['nothing'] === undefined) {
				return;
			}

			var recieved_input = [];
			this.parse_keys_and_buttons(function(target, func) {
				recieved_input.push(target);
			});
			
			_.each(action_map['nothing'], function(action) {
				var target = action.target;
				var func = action.func;

				if (recieved_input.indexOf(target) === -1) {
					game_state[target][action.func]();
				}
			});
		}
	};

	watchjs.watch(user_input, input_bindings.handle_no_input.bind(input_bindings));
	return input_bindings;
};