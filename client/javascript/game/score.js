define(["lodash"], function(_) {
	"use strict";

	return {
		score: 0,
        score_changed: true,

        calculate_score: function(invaders, duration, misses) {
            var old_score = this.score;
            
            this.score = 0;
            this.score += _.where(invaders, {active: false, type: "skull"}).length * 5;
            this.score += _.where(invaders, {active: false, type: "bug"}).length * 10;
            this.score += _.where(invaders, {active: false, type: "squid"}).length * 20;
            //TODO: write a test for ~~ of a number to see if it has any biases during rounding.
            // this.score -= ~~(duration);
            this.score -= misses;

            this.score_changed = old_score !== this.score;
        }
	}
})