requirejs = require('../spec_helper').requirejs
asevented = require('../stubs/asevented').asevented
module_mock = require('../stubs/module_mock')

module_mock.reset(requirejs)
module_mock.stub(requirejs, 'ext/asevented', asevented)

InvaderBullet = requirejs('invaders/invader_bullet')
enums = requirejs('invaders/enums')
Tank = requirejs('invaders/tank')
Invader = requirejs('invaders/invader')
describe "A space invaders bullet", ->
  bullet = null

  beforeEach ->
    velocity = Math.random()
    x = Math.random()
    y = Math.random()
    bullet = new InvaderBullet()
    bullet.shoot(velocity, x, y)

  describe "when it is created", ->
    it "should be on the Invaders team", ->
      expect(bullet.team).toEqual(enums.Teams.Invaders)

    it "should have a unique id", ->
      current = bullet.id
      b1 = new InvaderBullet()
      b2 = new InvaderBullet()
      expect(b1.id).toBe(current + 1)
      expect(b2.id).toBe(current + 2)

  describe "when shot", ->
    it "should emit an event", ->
      bullet.share_locally = jasmine.createSpy('bullet.share_locally')
      bullet.shoot()
      expect(bullet.share_locally).toHaveBeenCalledWith('spawn', bullet)

  describe "collisions", ->
    beforeEach ->
      bullet.shoot(0, 0, 0)

    it "should not collide with invaders", ->
      bullet.collide(new Invader(null, enums.InvaderTypes.Bug))
      expect(bullet.active).toBeTruthy()

    it "should collide with the tank", ->
      bullet.collide(new Tank())
      expect(bullet.active).toBeFalsy()

    describe "when colliding with a tank", ->
      it "should emit a bullet die event", ->
        bullet.share_locally = jasmine.createSpy('bullet.share_locally')
        bullet.collide(new Tank())
        expect(bullet.share_locally).toHaveBeenCalledWith('die')
