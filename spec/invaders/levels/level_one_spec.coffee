requirejs = require('../../spec_helper').requirejs
sound = require('../../stubs/sound_manager').sound
sound_manager = require('../../stubs/sound_manager').sound_manager
three = require('../../stubs/three').three
module_mock = require('../../stubs/module_mock')
module_mock.reset(requirejs)
asevented = require('../../stubs/asevented').asevented

module_mock.stub(requirejs, 'ext/asevented', asevented)


thing =
  model:
    on_event: jasmine.createSpy('on_event')
  view: 'derp'
  audio_emitter: 'herp'
tank =
  model:
    spawn: jasmine.createSpy('tank.spawn')
    on_event: jasmine.createSpy('on_event')
  view: 'view'
  audio_emitter: 'herp'
swarm =
  model:
    on_event: jasmine.createSpy('on_event')
  view: 'view'
  audio_emitter: 'herp'

stub_thing_factory =
  make_bullet: jasmine.createSpy('make_bullet').andReturn(thing)
  make_tank: jasmine.createSpy('make_tank').andReturn(tank)
  make_invader_bullet: jasmine.createSpy('make_invader_bullet').andReturn(thing)
  make_bug_invader: jasmine.createSpy('make_bug_invader').andReturn(thing)
  make_squid_invader: jasmine.createSpy('make_squid_invader').andReturn(thing)
  make_skull_invader: jasmine.createSpy('make_skull_invader').andReturn(thing)
  make_swarm: jasmine.createSpy('make_swarm').andReturn(swarm)

ThingFactory = module_mock.spy_and_mock(requirejs, 'invaders/thing_factory', stub_thing_factory)
Three = module_mock.stub(requirejs, 'ext/three', three)

level = null

LevelOne = requirejs('invaders/level/one')
describe "level one", ->
  beforeEach ->
    level = new LevelOne(100, 200, sound_manager)

  describe "when setting up all the things", ->
    it "should create 50 invaders", ->
      expect(stub_thing_factory.make_invader_bullet.callCount).toBe(50)
      expect(stub_thing_factory.make_squid_invader.callCount).toBe(10)
      expect(stub_thing_factory.make_bug_invader.callCount).toBe(20)
      expect(stub_thing_factory.make_skull_invader.callCount).toBe(20)

    it "should create a bullet", ->
      expect(stub_thing_factory.make_bullet).toHaveBeenCalled()

    it "should create a tank", ->
      expect(stub_thing_factory.make_tank).toHaveBeenCalled()

    it "should a swarm of invaders going right", ->
      expect(stub_thing_factory.make_swarm).toHaveBeenCalled()

    it "should on_event to the tank die event", ->
      expect(tank.model.on_event).toHaveBeenCalledWith('die', any(Function))

    it "should on_event to the swarm die event", ->
      expect(swarm.model.on_event).toHaveBeenCalledWith('die', any(Function))
