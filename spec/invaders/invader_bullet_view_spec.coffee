requirejs = require('../spec_helper').requirejs
three = require('../stubs/three').three
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

invader_bullet =
  id: 1
  on_event: jasmine.createSpy('invader_bullet.on_event')
  box:
    x: Math.random()
    y: Math.random()

sprite =
  mesh:
    visible: true
SpriteView = module_mock.spy_on(requirejs, "lib/sprite_view").andReturn(sprite)

InvaderBulletView = requirejs('invaders/invader_bullet_view')
Resources = requirejs('invaders/resources')
describe "invader bullet view", ->
  view = new InvaderBulletView(invader_bullet)

  it "should create a sprite view using the invader bullet image", ->
    expect(SpriteView).toHaveBeenCalledWith(invader_bullet, Resources.Images.InvaderBullet)

module_mock.stop(requirejs, "lib/sprite_view")
module_mock.stop(requirejs, "invaders/invader_bullet_view")


module_mock.stub(requirejs, "ext/three", three)

InvaderBulletView = requirejs('invaders/invader_bullet_view')
describe "invader bullet view", ->
  view = null

  beforeEach ->
    view = new InvaderBulletView(invader_bullet)

  describe "during creation", ->
    it "should on_event show to the invader bullet spawn event", ->
      expect(invader_bullet.on_event).toHaveBeenCalledWith('spawn', view.show)

    it "should on_event update position to the invader bullet spawn event", ->
      expect(invader_bullet.on_event).toHaveBeenCalledWith('spawn', view.update_position)

    it "should on_event hide to the invader bullet die event", ->
      expect(invader_bullet.on_event).toHaveBeenCalledWith('die', view.hide)

    it "should on_event update position to the invader bullet update event", ->
      expect(invader_bullet.on_event).toHaveBeenCalledWith('update', view.update_position)

  describe "when showing the view", ->
    it "should become visible", ->
      view.mesh.visible = false
      view.show()
      expect(view.mesh.visible).toBe(true)

  describe "when hiding the view",->
    it "should stop being visible", ->
      view.mesh.visible = true
      view.hide()
      expect(view.mesh.visible).toBe(false)

  describe "when an updating the position", ->
    it "should update it's position", ->
      view.mesh.position.x = Math.random()
      view.mesh.position.y = Math.random()
      invader_bullet.box.x = Math.random()
      invader_bullet.box.y = Math.random()
      view.update_position(invader_bullet)
      expect(view.mesh.position.x).toBe(invader_bullet.box.x)
      expect(view.mesh.position.y).toBe(invader_bullet.box.y)
