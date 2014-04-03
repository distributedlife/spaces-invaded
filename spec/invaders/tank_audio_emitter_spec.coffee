requirejs = require('../spec_helper').requirejs
sound = require('../stubs/sound_manager').sound
sound_manager = require('../stubs/sound_manager').sound_manager
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

tank =
  on_event: jasmine.createSpy('on_event')
emitter = null

AudioEmitter = module_mock.spy_on(requirejs, "lib/audio_emitter")
TankAudioEmitter = requirejs('invaders/tank_audio_emitter')
Resources = requirejs('invaders/resources')
describe "tank audio emitter", ->
  describe "during creation", ->
    beforeEach ->
      emitter = new TankAudioEmitter(tank, sound_manager)

    it "should create an audio emitter with the tank die sound", ->
      expect(AudioEmitter).toHaveBeenCalledWith(sound_manager, 'tank_die', Resources.Sounds.TankDie)

    it "should on_event emit to the tank die event", ->
      expect(tank.on_event).toHaveBeenCalledWith('die', emitter.play)
