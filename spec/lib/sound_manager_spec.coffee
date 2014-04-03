requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

sm = module_mock.spy_on(requirejs, "ext/soundmanager2-nodebug-jsmin")
stub_sound_manager =
  beginDelayedInit: jasmine.createSpy('beginDelayedInit')
global = jasmine.getGlobal()
global.SoundManager = jasmine.createSpy('SoundManager').andReturn(stub_sound_manager)

SoundManager = requirejs("lib/sound_manager2")
jsdom = requirejs("jsdom")
sound_manager = null

describe 'sound manager 2', ->
  describe 'when initialised', ->
    beforeEach ->
      sound_manager = new SoundManager()

    it 'should set the swf url', ->
      expect(sound_manager.url).toBe('/public/swf/')

    it 'should set debug to false', ->
      expect(sound_manager.debugMode).toBe(false)
      expect(sound_manager.debugMode).toBe(false)

    it 'should not prefer flash', ->
      expect(sound_manager.preferFlash).toBe(false)

    it 'should true to use HTML5 audio', ->
      expect(sound_manager.useHTML5Audio).toBe(true)

    it 'should set the flash version to 9', ->
      expect(sound_manager.flashVersion).toBe(9)
