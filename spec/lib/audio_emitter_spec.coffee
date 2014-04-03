requirejs = require('../spec_helper').requirejs
sound = require('../stubs/sound_manager').sound
sound_manager = require('../stubs/sound_manager').sound_manager

AudioEmitter = requirejs("lib/audio_emitter")
filename = 'path/to/my/audio.ogg'
id = 'unique'
emitter = null

describe "the thing sound emitter", ->
  describe "when being created", ->
    beforeEach ->
      emitter = new AudioEmitter(sound_manager)

    it "should load the audio file", ->
      expect(emitter.sound).not.toBe(null)

  describe "when loading the audio", ->
    beforeEach ->
      emitter = new AudioEmitter(sound_manager, id, filename)

    it "should specify the filename and the unique id", ->
      expect(sound_manager.createSound).toHaveBeenCalledWith({url: filename, id: id})

  describe "when playing sound", ->
    beforeEach ->
      emitter = new AudioEmitter(sound_manager, id, filename)

    it "should play the sound", ->
      emitter.play()
      expect(sound.play).toHaveBeenCalled()

  describe "when stop is called", ->
    beforeEach ->
      emitter = new AudioEmitter(sound_manager, id, filename)

    it "should stop playing the sound", ->
      emitter.stop()
      expect(sound.stop).toHaveBeenCalled()
