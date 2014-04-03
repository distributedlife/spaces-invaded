requirejs = require('../spec_helper').requirejs
sound = require('../stubs/sound_manager').sound
sound_manager = require('../stubs/sound_manager').sound_manager
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

bullet =
  on_event: jasmine.createSpy('bullet.on_event')
emitter = null

AudioEmitter = module_mock.spy_on(requirejs, "lib/audio_emitter")

BulletAudioEmitter = requirejs('invaders/bullet_audio_emitter')
Resources = requirejs('invaders/resources')
describe "bullet audio emitter", ->
  describe "during creation", ->
    emitter = new BulletAudioEmitter(bullet, sound_manager)

    it "should create an audio emitter with the bullet sound", ->
      expect(AudioEmitter).toHaveBeenCalledWith(sound_manager, 'bullet_shoot', Resources.Sounds.TankBullet)

    it "should link emit to the bullet spawn event", ->
      expect(bullet.on_event).toHaveBeenCalledWith('spawn', emitter.play)

    it "should link stop to the bullet die event", ->
      expect(bullet.on_event).toHaveBeenCalledWith('die', emitter.stop)
