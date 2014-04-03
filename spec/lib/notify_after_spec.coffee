requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

unique_stub =
	id: -> 5
true_callback = jasmine.createSpy('callback').andReturn(true)
false_callback = jasmine.createSpy('callback').andReturn(false)

module_mock.stub(requirejs, 'lib/unique', unique_stub)
module_mock.spy_on(requirejs, 'ext/asevented')

ref_to_original_func = jasmine.createSpy('func').andReturn(true)
ref_to_original_zepher = jasmine.createSpy('zepher').andReturn(5)
ref_to_original_zapper = jasmine.createSpy('zapper').andReturn(7)
thing =
	bind: jasmine.createSpy('bind')
	trigger: jasmine.createSpy('trigger')
	func: ref_to_original_func
	zepher: ref_to_original_zepher
	zapper: ref_to_original_zapper
notify_after = requirejs('lib/notify_after')
notify_hash = [
	{after: 'func', event: 'hola'}
	{after: 'zepher', when: true_callback, event: 'wu'}
	{after: 'zapper', when: false_callback, event: 'orgk'}
]

my_func = ->

describe "notify after", ->
	beforeEach ->
		notify_after(thing, 'thing', notify_hash)

	it "should assign the thing the next unique id", ->
		expect(thing.id).toBe(5)

	it "should set the typename of the thing", ->
		expect(thing.typename).toBe('thing')

	it "should add an share_locally method to the thing", ->
		expect(thing.share_locally).not.toBe(null)

	it "should add an on_event method to the thing", ->
		expect(thing.on_event).not.toBe(null)

	it "should add an entity_name method to the thing", ->
		expect(thing.entity_name).not.toBe(null)

	describe "calling a function listed in the notification hashes", ->
		it "should call the original function", ->
			thing.func(1,2,3)
			expect(ref_to_original_func).toHaveBeenCalledWith(1,2,3)

		it "should emit the listed event", ->
			thing.share_locally = jasmine.createSpy('share_locally')
			thing.func()
			expect(thing.share_locally).toHaveBeenCalledWith('hola', thing)

		it "should return the original return value", ->
			expect(thing.func()).toBe(true)

		describe "when a 'when' condition is supplied", ->
			it "should only emit an event when the callback returns true", ->
				thing.share_locally = jasmine.createSpy('share_locally')
				thing.zepher()
				thing.zapper()
				expect(thing.share_locally).toHaveBeenCalledWith('wu', thing)
				expect(thing.share_locally).not.toHaveBeenCalledWith('orgk', thing)
				expect(true_callback).toHaveBeenCalled()
				expect(false_callback).toHaveBeenCalled()

			it "should always return the return value", ->
				expect(thing.zepher()).toBe(5)
				expect(thing.zapper()).toBe(7)

	describe "share_locally", ->
		describe "when params are supplied", ->
			beforeEach ->
				thing.share_locally('name', 5)

			it "should call trigger and pass through the params", ->
				expect(thing.trigger).toHaveBeenCalledWith('thing:5:name', 5)

		describe "when no params are supplied", ->
			beforeEach ->
				thing.share_locally('name')

			it "should call trigger", ->
				expect(thing.trigger).toHaveBeenCalledWith('thing:5:name')

	describe "on_event", ->
		beforeEach ->
			thing.on_event('name', my_func)

		it 'bind the expanded event name and the callback', ->
			expect(thing.bind).toHaveBeenCalledWith('thing:5:name', my_func)

	describe "entity_name", ->
		it "should return the typename:id", ->
			expect(thing.entity_name()).toBe('thing:5')