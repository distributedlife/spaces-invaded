var rek = require('rekuire');
var _ = require('underscore');
var requirejs = rek('game/spec/spec_helper').requirejs
var Score = requirejs('score');

describe("Game Score", function() {
	var score = null;

	beforeEach(function() {
		score = {};
		_.extend(score, Score);
		console.log(score);
	});

	it("should start with a score of zero", function() {
		expect(score.calculate_score([], 0, 0)).toBe(0);
	});

	// it("should deduct a point for each miss", function() {
	// 	expect(score.calculate_score([], 0, 1)).toBe(-1);
	// });

	// it("should add 5 points for each skull invader", function() {
	// 	expect(score.calculate_score([{type: 'skull'}], 0, 0)).toBe(5);
	// });

	// it("should add 10 points for each bug invader", function() {
	// 	expect(score.calculate_score([{type: 'bug'}], 0, 0)).toBe(5);
	// });

	// it("should add 20 points for each bug invader", function() {
	// 	expect(score.calculate_score([{type: 'squid'}], 0, 0)).toBe(5);
	// });

	// it("should deduct one point for each second of play", function() {
	// 	expect(score.calculate_score([], 0.1, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.2, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.3, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.4, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.5, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.6, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.7, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.8, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 0.9, 0)).toBe(-1);
	// 	expect(score.calculate_score([], 1.0, 0)).toBe(-1);
	// });

	//TODO: score changed
});