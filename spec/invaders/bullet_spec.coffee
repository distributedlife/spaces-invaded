requirejs = require('../spec_helper').requirejs
asevented = require('../stubs/asevented').asevented
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

util = require("util")

event_emitter =
  call: jasmine.createSpy('event_emitter.call')
thing =
  call: jasmine.createSpy('thing.call')
bullet = null

module_mock.stub(requirejs, 'ext/asevented', asevented)
module_mock.stub(requirejs, 'lib/event_emitter', event_emitter)
module_mock.stub(requirejs, 'lib/thing', thing)

Bullet = requirejs('invaders/bullet')
enums = requirejs('invaders/enums')

describe "Bullet", ->
  beforeEach ->
    bullet = new Bullet()

  describe "when it has been created", ->
    it "should be on the Earth team", ->
      expect(bullet.team).toEqual(enums.Teams.Earth)

    it "should be an event_emitter", ->
      expect(event_emitter.call).toHaveBeenCalledWith(bullet)

    it "should be an invaders thing", ->
      expect(thing.call).toHaveBeenCalledWith(bullet)

  describe "whith normal", ->
    beforeEach ->
      module_mock.reset(requirejs)
      module_mock.stub(requirejs, 'ext/asevented', asevented)

      BoundingBox = requirejs('lib/bounding_box')
      Bullet = requirejs('invaders/bullet')
      enums = requirejs('invaders/enums')
      bullet = new Bullet()

    describe "when it is shot", ->
      velocity = null
      x = null
      y = null

      beforeEach ->
        velocity = Math.random()
        x = Math.random()
        y = Math.random()
        bullet.trigger = jasmine.createSpy('bullet.trigger')
        bullet.shoot(velocity, x, y)

      it "should be active", ->
        expect(bullet.active).toBeTruthy()

      it "should emit a bullet spawn event", ->
        expect(bullet.trigger).toHaveBeenCalledWith('bullet:' + bullet.id + ':spawn', bullet)

    describe "when it is updated", ->
      velocity = null
      x = null
      y = null
      delta_time = null

      beforeEach ->
        velocity = Math.random()
        x = Math.random()
        y = Math.random()
        delta_time = Math.random()
        bullet.shoot(velocity, x, y)
        bullet.share_locally = jasmine.createSpy('share_locally')
        bullet.update(delta_time)

      it "should move vertically at some velocity", ->
        expect(bullet.box.y).toEqual(y + (delta_time * velocity))

      it "should emit a bullet update event", ->
        expect(bullet.share_locally).toHaveBeenCalledWith('update', bullet)

      describe "when it goes off the top of the zone", ->
        it "should die", ->
          bullet.die = jasmine.createSpy('die')
          bullet.box.y = -1
          bullet.update(1)
          expect(bullet.die).toHaveBeenCalled()

    describe "when it is in a collision", ->
      Invader = null
      Tank = null
      beforeEach ->
        Invader = requirejs('invaders/invader')
        Tank = requirejs('invaders/tank')
        bullet.die = jasmine.createSpy('die')

      describe "when colliding with a tank", ->
        it "it should not die", ->
          bullet.collide(new Tank())
          expect(bullet.die).not.toHaveBeenCalled()

      describe "when collides with an invader", ->
        it "should die", ->
          bullet.collide(new Invader(null, enums.InvaderTypes.Bug))
          expect(bullet.die).toHaveBeenCalled()

    describe "when dying", ->
      beforeEach ->
        bullet.trigger = jasmine.createSpy('trigger')
        bullet.die()

      it "should emit a bullet die event", ->
        expect(bullet.trigger).toHaveBeenCalledWith('bullet:' + bullet.id + ':die')

      it "should not be active", ->
        expect(bullet.active).toBeFalsy()
