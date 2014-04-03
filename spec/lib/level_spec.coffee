requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

sound = require('../stubs/sound_manager').sound
sound_manager = require('../stubs/sound_manager').sound_manager
three = require('../stubs/three').three
asevented = require('../stubs/asevented').asevented

module_mock.stub(requirejs, 'ext/asevented', asevented)
text =
  style:
    display: 'banana'
    innerHTML: 'herp'
window =
  get_element_by_id: jasmine.createSpy('window.get_element_by_id').andReturn(text)

module_mock.stub(requirejs, 'lib/window', window)
Three = module_mock.stub(requirejs, 'ext/three', three)

level = null

Level = requirejs("lib/level")
describe "a level", ->
  beforeEach ->
    level = new Level(100, 200, sound_manager)

  describe "when the level is complete", ->
    it "should emit a level complete event", ->
      level.share_locally = jasmine.createSpy('level.share_locally')
      level.level_completed()
      expect(level.share_locally).toHaveBeenCalledWith('complete')

  describe "when the level is failed", ->
    it "should emit a level failed event", ->
      level.share_locally = jasmine.createSpy('level.share_locally')
      level.level_failed()
      expect(level.share_locally).toHaveBeenCalledWith('failure')
