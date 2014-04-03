requirejs = require('../spec_helper').requirejs
three = require('../stubs/three').three
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

invader =
  on_event: jasmine.createSpy('on_event')
  box:
    x: Math.random()
    y: Math.random()

sprite =
  mesh:
    position:
      z: 0
view = null
SpriteView = module_mock.spy_and_mock(requirejs, "lib/sprite_view", sprite)
Resources = requirejs('invaders/resources')
InvaderView = requirejs('invaders/invader_view')

describe "The invader view behaviour", ->
  describe "invader view", ->
    it "should create a sprite view using the invader image", ->
      invader.type = InvaderTypes.Bug
      view = new InvaderView(invader)
      expect(SpriteView).toHaveBeenCalledWith(invader, Resources.Images.InvaderBug)

      invader.type = InvaderTypes.Squid
      view = new InvaderView(invader)
      expect(SpriteView).toHaveBeenCalledWith(invader, Resources.Images.InvaderSquid)

      invader.type = InvaderTypes.Skull
      view = new InvaderView(invader)
      expect(SpriteView).toHaveBeenCalledWith(invader, Resources.Images.InvaderSkull)

  describe "invader view", ->
    beforeEach ->
      view = new InvaderView(invader)
      module_mock.stop(requirejs, "lib/sprite_view")
      module_mock.stop(requirejs, "invaders/invader_view")
      module_mock.stub(requirejs, "ext/three", three)

      InvaderView = requirejs('invaders/invader_view')

    describe "during creation", ->
      it "should on_event show to invader spawn event", ->
        expect(invader.on_event).toHaveBeenCalledWith('spawn', view.show)

      it "should on_event update position to invader spawn event", ->
        expect(invader.on_event).toHaveBeenCalledWith('spawn', view.update_position)

      it "should on_event to the invader update event", ->
        expect(invader.on_event).toHaveBeenCalledWith('update', view.update_position)

      it "should on_event to the invader die event", ->
        expect(invader.on_event).toHaveBeenCalledWith('die', view.hide)
