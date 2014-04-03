requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

event_propagator = requirejs('lib/event_propagator')

describe "event propagator", ->
	thing = {}
	beforeEach ->
		thing = {}
		event_propagator(thing)

	it "should add a propagate function to the thing", ->
		expect(thing.propagate).not.toBe(undefined)