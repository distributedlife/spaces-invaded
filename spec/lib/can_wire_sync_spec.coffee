requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

thing = {}
thing_fixture =
	source_id: 1
	time: 7
	chocolate: false
data_with_mismatched_id =
	id: 7
	time: 600
	chocolate: true
data_with_matched_id =
	id: 1
	time: 600
	chocolate: true
data_with_blank_id =
	time: 500
	chocolate: 'derp'

channel = "/things"
event = "movement"
field_map =
	time: 'time'
	bypass: 'chocolate'

callback = jasmine.createSpy('callback')

become_client_called = false
become_client = (obj, channel) ->
	become_client_called = true;
	obj.on_server_event = jasmine.createSpy('on_server_event')
module_mock.stub(requirejs, 'lib/become_client', become_client)

can_wire_sync = requirejs('lib/can_wire_sync')

describe 'wire synchronisation', ->
	beforeEach ->
		thing = thing_fixture
		can_wire_sync(thing, channel, [event], field_map)

	it 'should become a client', ->
		expect(become_client_called).toBeTruthy()

	it 'should add a synchronise function to thing', ->
		expect(thing.synchronise).not.toBe('undefined')

	it 'should call synchronise to the event', ->
		expect(thing.on_server_event).toHaveBeenCalledWith('movement', thing.synchronise)

	describe 'synchronisation', ->
		it 'should do nothing if the id of thing does not match the wire source id', ->
			thing.synchronise(data_with_mismatched_id)
			expect(thing.time).toBe(7)
			expect(thing.bypass).toBeFalsy()

		it 'should map the fields according to the field map if the source id is not set', ->
			thing.synchronise(data_with_matched_id)
			expect(thing.time).toBe(600)
			expect(thing.bypass).toBeTruthy()

		it 'should map the fields according to the field map if the source id matches', ->
			thing.synchronise(data_with_blank_id)
			expect(thing.time).toBe(500)
			expect(thing.bypass).toBe('derp')

		it 'should not call the custom callback when not supplied', ->
			expect(callback).not.toHaveBeenCalled()

		it 'should call the custom callback when supplied', ->
			thing = thing_fixture
			can_wire_sync(thing, channel, [event], field_map, callback)
			thing.synchronise(data_with_blank_id)
			expect(callback).toHaveBeenCalled();