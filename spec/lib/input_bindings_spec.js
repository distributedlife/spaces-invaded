requirejs = require('../spec_helper').requirejs

var game_state = {
	model: {
		no_event: jasmine.createSpy(),
		key_event: jasmine.createSpy(),
		touch_event: jasmine.createSpy(),
		cursor_event: jasmine.createSpy()
	}
};
var user_input = {
	raw_data: {}
};
var action_map = {};

watchjs = require('watchjs');

describe("Input Bindings", function() {
	beforeEach(function() {
		game_state.model.no_event.reset();
		game_state.model.key_event.reset();
		game_state.model.touch_event.reset();
		game_state.model.cursor_event.reset();
		
		action_map = {
			'key': [{target: 'model', func: 'key_event'}],
			'touch0': [{target: 'model', func: 'touch_event'}],
			'cursor': [{target: 'model', func: 'cursor_event'}],
			'nothing': [{target: 'model', func: 'no_event'}]
		};
	});

	describe("when no input has been received", function() {
		beforeEach(function() {
			user_input.raw_data = { keys: [], touches: [] };	
		})
		
		it("should call the 'no_event' on the 'model' bound as 'nothing'", function() {
			require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs).handle_no_input();
			expect(game_state.model.no_event).toHaveBeenCalled();
		});

		describe("when no action map has been configured for 'nothing'", function() {
			beforeEach(function() {
				action_map = {};
			});

			it ("should do nothing", function() {
				require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs).handle_no_input();
				expect(game_state.model.no_event).not.toHaveBeenCalled();
			});
		});
	})

	describe("when key input has been received", function() {
		beforeEach(function() {
			user_input.raw_data = { keys: ['key'], touches: [] };	
		})

		it("should not call the 'no_event' on the 'model' bound as 'nothing'", function() {
			require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs).handle_no_input();
			expect(game_state.model.no_event).not.toHaveBeenCalled();
		});

		it("should call any matching functions with a force of one", function() {
			require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs).map_input_to_action();
			expect(game_state.model.key_event).toHaveBeenCalledWith(1.0);
		});
	});

	describe("when touch input has been received", function() {
		beforeEach(function() {
			user_input.raw_data = { touches: [{id: 0, x: 4, y: 5}] };	
		})

		it("should not call the 'no_event' on the 'model' bound as 'nothing'", function() {
			require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs).handle_no_input();
			expect(game_state.model.no_event).not.toHaveBeenCalled();
		});

		it("should call any matching functions with the touch coordinates", function() {
			require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs).map_input_to_action();
			expect(game_state.model.touch_event).toHaveBeenCalledWith(4, 5);
		});
	});

	describe("when mouse input has been received", function() {
		beforeEach(function() {
			user_input.raw_data = { x: 6, y: 7 };	
		})

		it("should call any matching functions with the touch coordinates", function() {
			require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs).map_input_to_action();
			expect(game_state.model.cursor_event).toHaveBeenCalledWith(6, 7);
		});
	});

	describe("when raw_data changes", function() {
		beforeEach(function() {
			user_input.raw_data = { keys: [], touches: [] };
		})

		it("should call 'handle_no_input'", function() {
			var input_bindings = require('../../server/javascript/lib/input_bindings')(game_state, user_input, action_map, watchjs);
			input_bindings.handle_no_input = jasmine.createSpy();

			watchjs.callWatchers(user_input.raw_data, "keys");

			expect(game_state.model.no_event).toHaveBeenCalled();
		});
	});
});