requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

io =
	connect: jasmine.createSpy('connect')
module_mock.stub(requirejs, 'socket.io', io)

thing = {}
channel = "/thing"
become_client = requirejs('lib/become_client') 

describe "becoming a client", ->
	beforeEach ->
		thing = {}
		become_client(thing, channel)

	it "should do nothing if the thing already has a socket", ->
		thing =
			socket: 'something'
		io.connect.reset()
		become_client(thing, channel)
		expect(io.connect).not.toHaveBeenCalledWith('/thing')

	it "should connect to the channel if no socket exists", ->
		expect(io.connect).toHaveBeenCalledWith('/thing')

	it "should add notify_server behaviour to the thing", ->
		expect(thing.notify_server).not.toBe(undefined)

	it "should add on_server_event behaviour to the thing", ->
		expect(thing.on_server_event).not.toBe(undefined)

	describe "notify server behaviour", ->
		beforeEach ->
			thing.socket =
				emit: jasmine.createSpy('emit')

		describe "when params are supplied", ->
			beforeEach ->
				thing.notify_server('event', {a: 'a'})

			it "should emit the event with params", ->
				expect(thing.socket.emit).toHaveBeenCalledWith('event', {a: 'a'})

		describe "when no params supplied", ->
			beforeEach ->
				thing.notify_server('event')

			it "should emit the event without params", ->
				expect(thing.socket.emit).toHaveBeenCalledWith('event')

	describe "on server event behaviour", ->
		continuation = null
		data = null

		beforeEach ->
			thing.socket =
				on: jasmine.createSpy('on')
			continuation = jasmine.createSpy('cont')
			thing.on_server_event('event', continuation)

		it "should call the function when the socket message is received", ->
			expect(thing.socket.on).toHaveBeenCalledWith('event', continuation)	