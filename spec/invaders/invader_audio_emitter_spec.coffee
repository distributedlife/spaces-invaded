requirejs = require('../spec_helper').requirejs
sound = require('../stubs/sound_manager').sound
sound_manager = require('../stubs/sound_manager').sound_manager
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

invader =
  id: 1
  on_event: jasmine.createSpy('invader.on_event')
emitter = null

AudioEmitter = module_mock.spy_on(requirejs, "lib/audio_emitter")
InvaderAudioEmitter = requirejs('invaders/invader_audio_emitter')
Resources = requirejs('invaders/resources')
describe "invader audio emitter", ->
  describe "during creation", ->
    beforeEach ->
      emitter = new InvaderAudioEmitter(invader, sound_manager)

    it "should create an audio emitter with the invader sound", ->
      expect(AudioEmitter).toHaveBeenCalledWith(sound_manager, 'invader_die1', Resources.Sounds.InvaderDie)

    it "should bind emit to the invader die event", ->
      expect(invader.on_event).toHaveBeenCalledWith('die', emitter.play)
