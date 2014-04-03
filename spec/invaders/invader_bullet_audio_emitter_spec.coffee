requirejs = require('../spec_helper').requirejs
sound = require('../stubs/sound_manager').sound
sound_manager = require('../stubs/sound_manager').sound_manager
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

invader_bullet =
  id: 1
  on_event: jasmine.createSpy('bind')
emitter = null

AudioEmitter = module_mock.spy_on(requirejs, "lib/audio_emitter")
InvaderBulletAudioEmitter = requirejs('invaders/invader_bullet_audio_emitter')
Resources = requirejs('invaders/resources')
describe "invader bullet audio emitter", ->
  describe "during creation", ->
    beforeEach ->
      emitter = new InvaderBulletAudioEmitter(invader_bullet, sound_manager)

    it "should create an audio emitter with the invader bullet sound", ->
      expect(AudioEmitter).toHaveBeenCalledWith(sound_manager, 'invader_bullet1', Resources.Sounds.InvaderBullet)

    it "should bind emit to the bullet spawn event", ->
      expect(invader_bullet.on_event).toHaveBeenCalledWith('spawn', emitter.play)

    it "should bind stop to the bullet die event", ->
      expect(invader_bullet.on_event).toHaveBeenCalledWith('die', emitter.stop)
