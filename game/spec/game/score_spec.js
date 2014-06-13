var rek = require('rekuire');
var _ = require('underscore');
var requirejs = rek('game/spec/spec_helper').requirejs()
var Score = requirejs('score');

describe("Game Score", function() {
	var score = null;

	beforeEach(function() {
		score = Score;
	});

	it("should start with a score of zero", function() {
		score.calculate_score([], 0, 0);

		expect(score.score).toBe(0);
	});

	it("should deduct a point for each miss", function() {
		score.calculate_score([], 0, 1);

		expect(score.score).toBe(-1);
	});

	it("should add 5 points for each skull invader", function() {
		score.calculate_score([{type: 'skull', active: false}], 0, 0);

		expect(score.score).toBe(5);
	});

	it("should add 10 points for each bug invader", function() {
		score.calculate_score([{type: 'bug', active: false}], 0, 0);

		expect(score.score).toBe(10);
	});

	it("should add 20 points for each bug invader", function() {
		score.calculate_score([{type: 'squid', active: false}], 0, 0);

		expect(score.score).toBe(20);
	});

	it("should not score alive invaders", function() {
		score.calculate_score([{type: 'squid', active: true}], 0, 0);

		expect(score.score).toBe(0);
	});

	it("should deduct one point for each second of play", function() {
		score.calculate_score([], 0.1, 0);
		expect(score.score).toBe(0);

		score.calculate_score([], 0.2, 0);
		expect(score.score).toBe(0);

		score.calculate_score([], 0.3, 0);
		expect(score.score).toBe(0);

		score.calculate_score([], 0.4, 0);
		expect(score.score).toBe(0);

		score.calculate_score([], 0.5, 0);
		expect(score.score).toBe(-1);

		score.calculate_score([], 0.6, 0);
		expect(score.score).toBe(-1);

		score.calculate_score([], 0.7, 0);
		expect(score.score).toBe(-1);

		score.calculate_score([], 0.8, 0);
		expect(score.score).toBe(-1);

		score.calculate_score([], 0.9, 0);
		expect(score.score).toBe(-1);

		score.calculate_score([], 1.0, 0);
		expect(score.score).toBe(-1);

	});

	it("should track when the score changes", function() {
		score.calculate_score([], 0, 0);

		score.calculate_score([], 0, 0);
		expect(score.score_changed).toBeFalsy();

		score.calculate_score([], 0, 1);
		expect(score.score_changed).toBeTruthy();
	});
});