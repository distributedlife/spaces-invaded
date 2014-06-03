define([], function() {
	"use strict";

	return function(duration, on_tick_func) {
		return {
			age: 0,

			tick: function(dt) {
				this.age += dt;
				on_tick_func(dt);
			},

			is_alive: function() { return (this.age < duration || duration === 0); },
			progress: function() { return duration === 0 ? 0.0 : this.age / duration; }
		};
	};
});