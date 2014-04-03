requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)
sound_manager = require('../stubs/sound_manager').sound_manager
three = require('../stubs/three').three
web_socket = require('../stubs/web_socket').web_socket

window =
  request_animation_frame: jasmine.createSpy()
module_mock.stub(requirejs, "lib/window", window)

atom =
  bind: jasmine.createSpy('atom.bind')
  clearPressed: jasmine.createSpy('atom.clearPressed')
gamepad =
  getStates: jasmine.createSpy('gamepad.get_states')
Gamepad = module_mock.stub(requirejs, "ext/gamepad", gamepad)
SoundManager = module_mock.spy_and_mock(requirejs, "lib/sound_manager2", sound_manager)
Metric = module_mock.spy_on(requirejs, "lib/metric")
scene_renderer =
  animate: jasmine.createSpy('scene_renderer.animate')
  change_scene: jasmine.createSpy('scene_renderer.change_scene')
  resize: jasmine.createSpy('scene_renderer.resize')
SceneRenderer = module_mock.spy_and_mock(requirejs, "lib/scene_renderer", scene_renderer)
Atom = module_mock.spy_and_mock(requirejs, "ext/atom", atom)
module_mock.stub(requirejs, "ext/three", three)

Game = requirejs("lib/game")
game = null

describe "a game", ->
  beforeEach ->
    game = new Game()

  describe "when the game is started", ->
    beforeEach ->
      game.loop = jasmine.createSpy('loop')
      game.start()

    it "should be not be running", ->
      expect(game.running).toBeTruthy()

    it "should start the game loop", ->
      expect(game.loop).toHaveBeenCalled()

    it "should create a metrics target", ->
      expect(Metric).toHaveBeenCalled()

    it "should create a sound manager", ->
      expect(SoundManager).toHaveBeenCalled()

  describe "when the game is stopped", ->
    beforeEach ->
      game.loop = jasmine.createSpy()
      game.start()
      game.stop()

    it "should not be running", ->
      expect(game.running).toBeFalsy()

    it "should exit the game loop", ->
      game.step = jasmine.createSpy('step')
      game.loop()
      expect(game.step).not.toHaveBeenCalled()

  describe "when updating", ->
    delta = null

    beforeEach ->
      delta = 5
      game.game_logic =
        update: jasmine.createSpy()
      game.update(delta)

    it "should update the game", ->
      expect(game.game_logic.update).toHaveBeenCalledWith(delta, atom)

  describe "when running the game loop", ->
    beforeEach ->
      game.scene_renderer =
        animate: jasmine.createSpy()
      game.game_logic =
        update: jasmine.createSpy()
      game.running = true
      game.loop()

    it "should request an animation frame", ->
      expect(window.request_animation_frame).toHaveBeenCalledWith(game.loop)

    it "should render the scene", ->
      expect(game.scene_renderer.animate).toHaveBeenCalled()

module_mock.reset(requirejs)
