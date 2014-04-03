requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

ref_to_existing_method = jasmine.createSpy('ref_to_existing_method').andReturn("hi")

thing_fixture =
	existing_method: ref_to_existing_method
	derp: 6
connection =
	send_message_to_clients: jasmine.createSpy('send_message_to_clients')
event_map =
	existing_method: 'eventname'
field_map =
	prop: 'derp'

wire_sync_publisher = requirejs('lib/will_wire_push')

describe "wire sync publisher", ->
	thing = null

	beforeEach ->
		thing = thing_fixture
		wire_sync_publisher(thing, connection, event_map, field_map)

	it "should add a to wire method to the thing", ->
		expect(thing.to_wire).not.toBe(undefined)

	describe "when the functions in the event map are invoked", ->
		beforeEach ->
			ref_to_existing_method.reset()
			thing.existing_method('he', 2, true, 4)

		it "should emit the event listed after execution", ->
			expect(connection.send_message_to_clients).toHaveBeenCalledWith('eventname', thing.to_wire())

		it "should still call the original function", ->
			expect(ref_to_existing_method).toHaveBeenCalledWith('he', 2, true, 4)

		it "should return any original value", ->
			expect(thing.existing_method()).toBe('hi')

	describe "to wire", ->
		it "should return a json object with each field map key being a property set to the value of the field map value on the object", ->
			expect(thing.to_wire()).toEqual({prop: 6})
