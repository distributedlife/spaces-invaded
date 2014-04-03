requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

become_client_called = false
become_client = (obj, channel) ->
	become_client_called = true;
	obj.on_server_event = jasmine.createSpy('on_server_event')
module_mock.stub(requirejs, 'lib/become_client', become_client)

mirror_latest = requirejs('lib/mirror_latest')

describe "mirror latest behaviour", ->
	thing = null

	beforeEach ->
		thing = {}
		mirror_latest(thing, '/thing', 'eventname')

	it "should become a client", ->
		expect(become_client_called).toBeTruthy()

	it "add a change source id function to thing", ->
		expect(thing.change_source_id).not.toBe(undefined)

	it "should set the source_id to null", ->
		expect(thing.source_id).toBe(null)

	it "should change the source id when the server event is received", ->
		expect(thing.on_server_event).toHaveBeenCalledWith('eventname', thing.change_source_id)

	describe "changing the source id", ->
		beforeEach ->
			thing.change_source_id(50)

		it "should set the source id of thing to the passed in value", ->
			expect(thing.source_id).toBe(50)