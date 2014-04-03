requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)
three = require('../stubs/three').three

atom =
  bind: jasmine.createSpy('atom.bind')
  key:
    LEFT_ARROW: "left_arrow"
    RIGHT_ARROW: "right_arrow"
    SPACE: "space"
  bind_to_canvas: jasmine.createSpy('atom.bind_to_canvas')
game_logic =
  update: jasmine.createSpy('game_logic.update')
GameLogic = module_mock.spy_and_mock(requirejs, "invaders/game_logic", game_logic)
level =
  bind: jasmine.createSpy('level.bind')
  scene: {}
  camera: {}
element =
  appendChild: jasmine.createSpy('element.appendChild')
width = 900
height = 600
window =
  document: jasmine.createSpy('document')
module_mock.stub(requirejs, 'ext/window', window)
game =
  input: atom
module_mock.spy_and_mock(requirejs, "lib/game", game)
module_mock.stub(requirejs, "ext/three", three)

Game = requirejs('invaders/game')
describe "a game", ->
  game = null
  beforeEach ->
    game = new Game()

  describe "when creating the game", ->
    beforeEach ->
      game.init(level, element, width, height)

    it "should setup key bindings", ->
      expect(atom.bind).toHaveBeenCalledWith(atom.key.LEFT_ARROW, "left")
      expect(atom.bind).toHaveBeenCalledWith(atom.key.RIGHT_ARROW, "right")
      expect(atom.bind).toHaveBeenCalledWith(atom.key.SPACE, "shoot")

    it "should create game logic", ->
      expect(GameLogic).toHaveBeenCalled()
