requirejs = require('../spec_helper').requirejs
three = require('../stubs/three').three
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

sprite =
  mesh:
    visible: true
SpriteView = module_mock.spy_on(requirejs, "lib/sprite_view").andReturn(sprite)
Three = module_mock.stub(requirejs, "ext/three", three)
bullet =
  on_event: jasmine.createSpy('bullet.on_event')
  box:
    x: Math.random()
    y: Math.random()

BulletView = requirejs('invaders/bullet_view')
Resources = requirejs('invaders/resources')
describe "bullet view", ->
  view = new BulletView(bullet)

  it "should create a sprite view using the bullet image", ->
    expect(SpriteView).toHaveBeenCalledWith(bullet, Resources.Images.TankBullet)

module_mock.stop(requirejs, "lib/sprite_view")
module_mock.stop(requirejs, "invaders/bullet_view")

BulletView = requirejs('invaders/bullet_view')
Resources = requirejs('invaders/resources')
describe "bullet view", ->
  view = null

  beforeEach ->
    view = new BulletView(bullet)

  describe "during creation", ->
    it "should on_event show to the bullet spawn event", ->
      expect(bullet.on_event).toHaveBeenCalledWith('spawn', view.show)

    it "should on_event update position to the bullet spawn event", ->
      expect(bullet.on_event).toHaveBeenCalledWith('spawn', view.update_position)

    it "should on_event hide to the bullet die event", ->
      expect(bullet.on_event).toHaveBeenCalledWith('die', view.hide)

    it "should on_event update position to the bullet update event", ->
      expect(bullet.on_event).toHaveBeenCalledWith('update', view.update_position)


  describe "when show is triggered", ->
    it "should show the mesh", ->
      view.mesh.visible = false
      view.show()
      expect(view.mesh.visible).toBe(true)

  describe "when hide is triggered", ->
    it "should hide the mesh", ->
      view.mesh.visible = true
      view.hide()
      expect(view.mesh.visible).toBe(false)

  describe "when receiving a bullet update event", ->
    it "should position the mesh to where the bullet is", ->
      view.mesh.position.x = Math.random()
      view.mesh.position.y = Math.random()
      bullet.box.x = Math.random()
      bullet.box.y = Math.random()
      view.update_position(bullet)
      expect(view.mesh.position.x).toBe(bullet.box.x)
      expect(view.mesh.position.y).toBe(bullet.box.y)
