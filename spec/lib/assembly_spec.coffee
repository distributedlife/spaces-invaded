requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

window_shield =
  load_page: jasmine.createSpy('window.loadPage')
  get_element_by_id: jasmine.createSpy('window.get_element_by_id')
module_mock.stub(requirejs, 'lib/window', window_shield)

stub_game =
  init: jasmine.createSpy('stub_game.init')
  start: jasmine.createSpy('stub_game.start')

stub_level =
  on_event: jasmine.createSpy('stub_level.on_event')

config =
  game: jasmine.createSpy('config.game').andReturn(stub_game)
  level: jasmine.createSpy('config.level').andReturn(stub_level)
  succeeded: "succeded"
  failed: "failed"
  canvas: "derp"
  width: 400
  hight: 1002

assembly = null

GameAssembly = requirejs 'lib/assembly'
describe "an assembly", ->
  beforeEach ->
    assembly = new GameAssembly(config)

  describe "when being created", ->
    it "should create a new game", ->
      expect(config.game).toHaveBeenCalled()

    it "should create a new level", ->
      expect(config.level).toHaveBeenCalled()

    it "should bind to the level failure", ->
      expect(stub_level.on_event).toHaveBeenCalledWith('failure', assembly.failed)

    it "should bind to the level success", ->
      expect(stub_level.on_event).toHaveBeenCalledWith('complete', assembly.succeeded)

  describe "when the player fails", ->
    it "should redirect to the failed url", ->
      assembly.failed()
      expect(window_shield.load_page).toHaveBeenCalledWith(config.failed)

  describe "when the player succeeds", ->
    it "should redirect to the succeeded url", ->
      assembly.succeeded()
      expect(window_shield.load_page).toHaveBeenCalledWith(config.succeeded)
