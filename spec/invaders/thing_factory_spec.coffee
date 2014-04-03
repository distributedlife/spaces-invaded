requirejs = require('../spec_helper').requirejs

sound = require('../stubs/sound_manager').sound
sound_manager = require('../stubs/sound_manager').sound_manager
three = require('../stubs/three').three
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

stub_bullet = {derp: 'derp'}
stub_tank = {herp: 'herp'}
stub_invader = {foo: 'bar'}
stub_invader_bullet = {wammie: 'wozzle'}

Bullet = module_mock.spy_and_mock(requirejs, "invaders/bullet", stub_bullet)
BulletView = module_mock.spy_on(requirejs, "invaders/bullet_view")
BulletAudioEmitter = module_mock.spy_on(requirejs, "invaders/bullet_audio_emitter")

Tank = module_mock.spy_and_mock(requirejs, "invaders/tank", stub_tank)
TankView = module_mock.spy_on(requirejs, "invaders/tank_view")
TankAudioEmitter = module_mock.spy_on(requirejs, "invaders/tank_audio_emitter")

Invader = module_mock.spy_and_mock(requirejs, "invaders/invader", stub_invader)
InvaderView = module_mock.spy_on(requirejs, "invaders/invader_view")
InvaderAudioEmitter = module_mock.spy_on(requirejs, "invaders/invader_audio_emitter")

InvaderBullet = module_mock.spy_and_mock(requirejs, "invaders/invader_bullet", stub_invader_bullet)
InvaderBulletView = module_mock.spy_on(requirejs, "invaders/invader_bullet_view")
InvaderBulletAudioEmitter = module_mock.spy_on(requirejs, "invaders/invader_bullet_audio_emitter")

Swarm = module_mock.spy_on(requirejs, "invaders/swarm")

ThingFactory = requirejs('invaders/thing_factory')
describe "thing factory", ->
  thing_factory = new ThingFactory()

  describe "when making a bullet", ->
    bullet = thing_factory.make_bullet(sound_manager)

    it "should make a bullet", ->
      expect(bullet.model).toBeDefined()
      expect(Bullet).toHaveBeenCalled()

    it "should make a bullet view wired into the bullet", ->
      expect(bullet.view).toBeDefined()
      expect(BulletView).toHaveBeenCalledWith(stub_bullet)

    it "should make a bullet audio emitter wired into the bullet", ->
      expect(bullet.audio_emitter).toBeDefined()
      expect(BulletAudioEmitter).toHaveBeenCalledWith(stub_bullet, sound_manager)

  describe "when making a tank", ->
    tank = thing_factory.make_tank(stub_bullet, sound_manager)

    it "should make a tank", ->
      expect(tank.model).toBeDefined()
      expect(Tank).toHaveBeenCalledWith(stub_bullet)

    it "should make a tank view wired into the tank", ->
      expect(tank.view).toBeDefined()
      expect(TankView).toHaveBeenCalledWith(stub_tank)

    it "should make a tank audio emitter wired into tank", ->
      expect(tank.audio_emitter).toBeDefined()
      expect(TankAudioEmitter).toHaveBeenCalledWith(stub_tank, sound_manager)

  describe "when making an bug invader", ->
    invader = thing_factory.make_bug_invader(stub_invader_bullet, sound_manager)

    it "should make an invader", ->
      expect(invader.model).toBeDefined()
      expect(Invader).toHaveBeenCalledWith(stub_invader_bullet, "Bug")

    it "should make an invader view wired into the invader", ->
      expect(invader.view).toBeDefined()
      expect(InvaderView).toHaveBeenCalledWith(stub_invader)

    it "should make an invader audio emitter wired into the invader", ->
      expect(invader.audio_emitter).toBeDefined()
      expect(InvaderAudioEmitter).toHaveBeenCalledWith(stub_invader, sound_manager)

  describe "when making an skull invader", ->
    invader = thing_factory.make_skull_invader(stub_invader_bullet, sound_manager)

    it "should make an invader", ->
      expect(invader.model).toBeDefined()
      expect(Invader).toHaveBeenCalledWith(stub_invader_bullet, "Skull")

    it "should make an invader view wired into the invader", ->
      expect(invader.view).toBeDefined()
      expect(InvaderView).toHaveBeenCalledWith(stub_invader)

    it "should make an invader audio emitter wired into the invader", ->
      expect(invader.audio_emitter).toBeDefined()
      expect(InvaderAudioEmitter).toHaveBeenCalledWith(stub_invader, sound_manager)

  describe "when making an squid invader", ->
    invader = thing_factory.make_squid_invader(stub_invader_bullet, sound_manager)

    it "should make an invader", ->
      expect(invader.model).toBeDefined()
      expect(Invader).toHaveBeenCalledWith(stub_invader_bullet, "Squid")

    it "should make an invader view wired into the invader", ->
      expect(invader.view).toBeDefined()
      expect(InvaderView).toHaveBeenCalledWith(stub_invader)

    it "should make an invader audio emitter wired into the invader", ->
      expect(invader.audio_emitter).toBeDefined()
      expect(InvaderAudioEmitter).toHaveBeenCalledWith(stub_invader, sound_manager)

  describe "when making an invader bullet", ->
    invader_bullet = thing_factory.make_invader_bullet(sound_manager)

    it "should make an invader bullet", ->
      expect(invader_bullet.model).toBeDefined()
      expect(InvaderBullet).toHaveBeenCalled()

    it "should make an invader bullet view wired into the invader", ->
      expect(invader_bullet.view).toBeDefined()
      expect(InvaderBulletView).toHaveBeenCalledWith(stub_invader_bullet)

    it "should make an invader bullet audio emitter wired into the invader", ->
      expect(invader_bullet.audio_emitter).toBeDefined()
      expect(InvaderBulletAudioEmitter).toHaveBeenCalledWith(stub_invader_bullet, sound_manager)

  describe "when making a swarm", ->
    invaders = {}
    config = {}
    swarm = thing_factory.make_swarm(invaders, config)

    it "should make a swarm", ->
      expect(swarm.model).toBeDefined()
      expect(Swarm).toHaveBeenCalledWith(invaders, config)
