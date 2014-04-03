requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

thing = {}
extender = null
extend = requirejs('lib/extend')
func =
	apply: jasmine.createSpy('func')

describe "extension", ->
	it "should return an object with a using method", ->
		expect(extend(thing).using).not.toBe(undefined)

	describe "using", ->
		beforeEach ->
			extender = extend(thing)

		it "should call apply on the supplied function with the args", ->
			extender.using(func, [1])
			expect(func.apply).toHaveBeenCalledWith(null, [thing, 1])

		it "should add the object to extend to front of the args list", ->
			extender.using(func, [])
			expect(func.apply).toHaveBeenCalledWith(null, [thing])

		it "should return an extension object", ->
			expect(extender.using(func, []).using).not.toBe(null)