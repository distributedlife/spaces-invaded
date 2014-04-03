requirejs = require('../spec_helper').requirejs

module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

sync = null
a = jasmine.createSpyObj('a-client', ['on_event', 'my_method'])
b = jasmine.createSpyObj('b-client', ['on_event', 'my_method'])
clients = [a, b]
on_complete = jasmine.createSpy('on_complete')

WaitForAll = requirejs("lib/wait_for_all")
describe "wait for all", ->
  beforeEach ->
    module_mock.capture_events_on(a)
    module_mock.capture_events_on(b)
    sync = new WaitForAll("my_method", clients, "event", on_complete)

  it "should reset the completed count when started", ->
    sync.completed = 50
    sync.start()
    expect(sync.completed).toBe(0)

  it "should call the method on each client when started", ->
    sync.start()
    expect(a.my_method).toHaveBeenCalled()
    expect(b.my_method).toHaveBeenCalled()

  it "should pass through parameters", ->
    a.my_method.reset()
    b.my_method.reset()
    sync.start("hi")
    expect(a.my_method).toHaveBeenCalledWith("hi")
    expect(b.my_method).toHaveBeenCalledWith("hi")

    a.my_method.reset()
    b.my_method.reset()
    sync.start("hi", "there")
    expect(a.my_method).toHaveBeenCalledWith("hi", "there")
    expect(b.my_method).toHaveBeenCalledWith("hi", "there")

  it "should call the on complete method when all clients emit the 'event'", ->
    sync.start()
    sync.share_locally = jasmine.createSpy('sync.share_locally')
    a.test_event();
    expect(on_complete).not.toHaveBeenCalled()
    b.test_event();
    expect(on_complete).toHaveBeenCalled()
