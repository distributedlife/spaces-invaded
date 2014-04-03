requirejs = require('../spec_helper').requirejs
asevented = require('../stubs/asevented').asevented
module_mock = require('../stubs/module_mock')

module_mock.reset(requirejs)
module_mock.stub(requirejs, 'ext/asevented', asevented)

Invader = requirejs('invaders/invader')
enums = requirejs('invaders/enums')
Bullet = requirejs('invaders/bullet')
InvaderBullet = requirejs('invaders/invader_bullet')
describe "Invader", ->
  x = 0
  y = 0
  direction = -1
  velocity = 50
  invader = null
  invader_bullet =
    active: true
    team: enums.Teams.Invaders


  beforeEach ->
    invader = new Invader(invader_bullet, enums.InvaderTypes.Bug)

  describe "when it has been created", ->
    it "should not be alive", ->
      expect(invader.active).toBeFalsy()

    it "should be on the Invaders team", ->
      expect(invader.team).toEqual(enums.Teams.Invaders)

    it "should have a unique id", ->
      current = invader.id
      i1 = new Invader(invader_bullet, enums.InvaderTypes.Bug)
      i2 = new Invader(invader_bullet, enums.InvaderTypes.Bug)
      expect(i1.id).toBe(current + 1)
      expect(i2.id).toBe(current + 2)

    it "should set the dimensions based on the invader type", ->
      bug = new Invader(invader_bullet, enums.InvaderTypes.Bug)
      skull = new Invader(invader_bullet, enums.InvaderTypes.Skull)
      squid = new Invader(invader_bullet, enums.InvaderTypes.Squid)

      expect(bug.width).toBe(44)
      expect(bug.height).toBe(48)
      expect(squid.width).toBe(36)
      expect(squid.height).toBe(48)
      expect(skull.width).toBe(48)
      expect(skull.height).toBe(48)


  describe "when it is spawned", ->
    beforeEach ->
      x = Math.random()
      y = Math.random()
      invader.share_locally = jasmine.createSpy('invader.share_locally')
      invader.spawn(x, y, direction)

    it "should have a new position", ->
      expect(invader.box.x).toBe(x)
      expect(invader.box.y).toBe(y)

    it "should have a direction", ->
      expect(invader.direction).toBe(direction)

    it "should share_locally a spawn event", ->
      expect(invader.share_locally).toHaveBeenCalledWith('spawn', invader)

    it "should be active", ->
      expect(invader.active).toBeTruthy()

  describe "when it is involved in a collision", ->
    bullet_velocity = 100

    describe "with a tank", ->
      it "should die", ->
        invader.die = jasmine.createSpy('die')
        tank_bullet = new Bullet()
        tank_bullet.shoot(bullet_velocity, x, y)
        invader.collide(tank_bullet)
        expect(invader.die).toHaveBeenCalled()

    describe "with an invader bullet", ->
      it "should not die", ->
        invader.die = jasmine.createSpy('die')
        invader.collide(invader_bullet)
        expect(invader.die).not.toHaveBeenCalled()


  describe "when dying", ->
    it "should become inactive", ->
      invader.active = true
      invader.die()
      expect(invader.active).toBeFalsy()

    it "should emit a die event", ->
      invader.share_locally = jasmine.createSpy('share_locally')
      invader.die()
      expect(invader.share_locally).toHaveBeenCalledWith('die')


  describe "when updated", ->
    stub_input = {}

    describe "when active", ->
      beforeEach ->
        invader.spawn(x, y, direction)
        invader.share_locally = jasmine.createSpy('share_locally')
        invader.update(1, stub_input)

      it "should move laterally", ->
        new_box = invader.box
        expect(new_box.x).toEqual(x + velocity * direction)
        expect(new_box.y).toEqual(y)

      it "should emit an invader update event", ->
        expect(invader.share_locally).toHaveBeenCalledWith('update', invader)

    describe "shooting a bullet", ->
      stub_bullet = null
      shot_countdown = null
      time_elapsed_until_the_next_shot = null
      minimum_time_between_shots = 20

      elapse_shot_timer = ->
        invader.update(time_elapsed_until_the_next_shot)
        time_elapsed_until_the_next_shot = minimum_time_between_shots

      beforeEach ->
        time_elapsed_until_the_next_shot = shot_countdown
        shot_countdown = 20
        stub_bullet =
          shoot: jasmine.createSpy("stub_bullet.shoot")
        invader = new Invader(stub_bullet, enums.InvaderTypes.Bug)
        invader.spawn(x, y, direction)

      it "should only shoot if it is active", ->
        invader.active = false
        elapse_shot_timer()
        expect(stub_bullet.shoot).not.toHaveBeenCalled()

      describe "shooting when the timer has elapsed", ->
        width = 66
        height = 48
        beforeEach ->
          elapse_shot_timer()

        it "should shoot a bullet when the shot timer elapses", ->
          expect(stub_bullet.shoot).toHaveBeenCalled()

        it "should shoot the bullet from the middle of the invader", ->
          expect(stub_bullet.shoot).toHaveBeenCalledWith(jasmine.any(Number), x, y)

        it "should not shoot a bullet within twenty seconds of firing one before", ->
          invader.update(19)
          expect(stub_bullet.shoot.callCount).toEqual(1)

        it "should shoot a bullet every time the shot timer elapses", ->
          elapse_shot_timer()
          expect(stub_bullet.shoot.callCount).toEqual(2)

      describe "shooting when time elapses in increments less than a full second", ->
        it "should shoot a bullet when the minimum time elapses", ->
          invader.update(time_elapsed_until_the_next_shot - 1)
          invader.update(0.999)
          invader.update(0.010)
          expect(stub_bullet.shoot).toHaveBeenCalled()


  describe "when told to invade", ->
    beforeEach ->
      invader.spawn(x, y, direction)
      invader.invader_drop = 10
      invader.invade()

    it "should move toward the player's tank", ->
      expect(invader.box.y).toBe(y + 10)

    it "should change it's direction", ->
      expect(invader.direction).toBe(1)
