requirejs = require('../spec_helper').requirejs
asevented = require('../stubs/asevented').asevented
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

module_mock.stub(requirejs, 'ext/asevented', asevented)

Tank = requirejs('invaders/tank')
enums = requirejs('invaders/enums')
config = requirejs('lib/config')
describe "Tank", ->
  stub_bullet =
    active: false
  tank = null

  beforeEach ->
    tank = new Tank(stub_bullet)

  describe "when a tank is created", ->
    it "should not be active", ->
      expect(tank.active).toBeFalsy()

    it "should start in the middle of the zone", ->
      expect(tank.box.y).toEqual(500)

    it "should be on the Earth team", ->
      expect(tank.team).toEqual(enums.Teams.Earth)


  describe "when tank is in a collision", ->
    describe "when it collides with something on the Invaders team", ->
      beforeEach ->
        other_thing =
          team: enums.Teams.Invaders
        tank.die = jasmine.createSpy('die')
        tank.collide(other_thing)

      it "should die", ->
        expect(tank.die).toHaveBeenCalled()

    describe "when it collides with something on its own team", ->
      beforeEach ->
        other_thing =
          team: enums.Teams.Earth
        tank.die = jasmine.createSpy('die')
        tank.collide(other_thing)

      it "should do nothing", ->
        expect(tank.die).not.toHaveBeenCalled()


  describe "when dying", ->
    beforeEach ->
      config.nodamage = false

    it "should emit a tank die event", ->
      tank.share_locally = jasmine.createSpy('share_locally')
      tank.die()
      expect(tank.share_locally).toHaveBeenCalledWith('die')

  describe "when the tank has been updated", ->
    input =
      pads: []
      pressed: ->
      down: ->

    priorX = 0
    delta = Math.random()

    beforeEach ->
      priorX = tank.box.x

    describe "when active", ->
      it "should emit an tank update event", ->
        tank.active = true
        tank.share_locally = jasmine.createSpy('share_locally')
        tank.update(delta, input)
        expect(tank.share_locally).toHaveBeenCalledWith('update', tank)

    describe "when using a gamepad", ->
      beforeEach ->
        input =
          pads:
            [
              leftStickX: Math.random()
              faceButton0: 0
            ]
          pressed: ->
          down: ->

      describe "when the left paddle is moved", ->
        describe "left", ->
          beforeEach () ->
            input.pads[0].leftStickX * -1
            tank.update(delta, input)
          
          it "should move the tank left", ->
            box = tank.box
            expect(box.x).toEqual(priorX + (input.pads[0].leftStickX * tank.maxVelocity * delta))

        describe "right", ->
          it "should move the tank right", ->
            tank.update(delta, input)
            box = tank.box
            expect(box.x).toEqual(priorX + (input.pads[0].leftStickX * tank.maxVelocity * delta))

      describe "when button 0 is pressed", ->
        beforeEach ->
          input.pads[0].faceButton0 = 1

        it "should shoot", ->
          stub_bullet.shoot = jasmine.createSpy("stub_bullet.shoot")
          tank.update(delta, input)
          expect(stub_bullet.shoot).toHaveBeenCalledWith(-200, tank.box.x, tank.box.y)

    describe "when using the keyboard", ->
      describe "when the left arrow is pressed", ->
        beforeEach ->
          input =
            pressed: ->
            down: (e) ->
              return e == "left"
          tank.update(delta, input)

        it "should move the tank left", ->
          box = tank.box
          expect(box.x).toEqual(priorX - (tank.maxVelocity * delta))

      describe "when the right arrow is pressed", ->
        beforeEach ->
          input =
            pressed: ->
            down: (e) ->
              return e == "right"
          tank.update(delta, input)

        it "should move the tank right", ->
          box = tank.box
          expect(box.x).toEqual(priorX + (tank.maxVelocity * delta))

      describe "when the spacebar is pressed", ->
        beforeEach ->
          input =
            pressed: (e) ->
              return e == "shoot"
            down: ->
          tank.update(delta, input)

        it "should shoot", ->
          stub_bullet.shoot = jasmine.createSpy("stub_bullet.shoot")
          tank.update(delta, input)
          expect(stub_bullet.shoot).toHaveBeenCalledWith(-200, tank.box.x, tank.box.y)

    describe "when shooting", ->
      beforeEach ->
        input =
          pads:
            [
              leftStickX: Math.random()
              faceButton0: 1
            ]
          pressed: ->
          down: ->
        tank.update(delta, input)

      it "should not shoot if the current bullet is still active", ->
        tank.update(delta, input)
        stub_bullet.active = true
        stub_bullet.shoot = jasmine.createSpy("stub_bullet.shoot")
        tank.update(delta, input)
        expect(stub_bullet.shoot).not.toHaveBeenCalled()
