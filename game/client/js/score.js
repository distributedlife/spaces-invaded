define(["lodash"], function(_) {
	"use strict";

	return {
		score: 0,
        score_changed: true,
        values: {
            squid: 20,
            bug: 10,
            skull: 5
        },

        calculate_score: function(invaders, duration, misses) {
            var old_score = this.score;
            
            this.score = 0;
            _.each(["skull", "bug", "squid"], function(type) {
                this.score += _.where(invaders, {active: false, type: type}).length * this.values[type];
            }.bind(this));

            this.score -= Math.round(duration);
            this.score -= misses;

            this.score_changed = old_score !== this.score;
        }
	}
})