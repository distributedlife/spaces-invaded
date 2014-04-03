requirejs = require('../spec_helper').requirejs
three = require('../stubs/three').three
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

tank =
  box:
    x: Math.random()
    y: Math.random()
  on_event: jasmine.createSpy('on_event')

SpriteView = module_mock.spy_on(requirejs, "lib/sprite_view")

TankView = requirejs('invaders/tank_view')
Resources = requirejs('invaders/resources')
describe "tank view", ->
 view = new TankView(tank)

 it "should create a sprite view using the tank image", ->
   expect(SpriteView).toHaveBeenCalledWith(tank, Resources.Images.Tank)

module_mock.stop(requirejs, "lib/sprite_view")
module_mock.stop(requirejs, "invaders/tank_view")


module_mock.stub(requirejs, "ext/three", three)
TankView = requirejs('invaders/tank_view')
Resources = requirejs('invaders/resources')

view = null

describe "tank view", ->
  beforeEach ->
    view = new TankView(tank)

  describe "when created", ->
    it "should bind show to the tank spawn event", ->
      expect(tank.on_event).toHaveBeenCalledWith('spawn', view.show)

    it "should bind update position to the tank spawn event", ->
      expect(tank.on_event).toHaveBeenCalledWith('spawn', view.update_position)

    it "should bind update position to the tank update event", ->
      expect(tank.on_event).toHaveBeenCalledWith('update', view.update_position)

    it "should bind to the tank die event", ->
      
