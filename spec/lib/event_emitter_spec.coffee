requirejs = require('../spec_helper').requirejs
asevented = require('../stubs/asevented').asevented
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

module_mock.stub(requirejs, 'ext/asevented', asevented)

EventEmitter = requirejs('lib/event_emitter')
describe "an event emitter", ->
  ee = null

  beforeEach ->
    ee = ->
      return this
    EventEmitter.call(ee)
    ee.typename = 'EventEmitter'

  describe "when created", ->
    it "should have a unique id", ->
      ee2 = ->
        return this
      EventEmitter.call(ee2)
      expect(ee2.id).toBe(ee.id + 1)

  describe "event name", ->
    it "should return it's unique id to the event name", ->
      expect(ee.event_name('event')).toBe("EventEmitter:#{ee.id}:event")

  describe "share_locally", ->
    it "should trigger the event using the constructed event name", ->
      ee.trigger = jasmine.createSpy('EventEmitter.trigger')
      ee.share_locally('spawn', {})
      expect(ee.trigger).toHaveBeenCalledWith(ee.event_name('spawn'), {})

    it "should optionally take the second param", ->
      ee.trigger = jasmine.createSpy('EventEmitter.trigger')
      ee.share_locally('spawn')
      expect(ee.trigger).toHaveBeenCalledWith(ee.event_name('spawn'))

  describe "on_event", ->
    it "should bind to the event using the constructed event name", ->
      callback = ->
      ee.bind = jasmine.createSpy('EventEmitter.bind')
      ee.on_event('spawn', callback)
      expect(ee.bind).toHaveBeenCalledWith(ee.event_name('spawn'), callback)
