requirejs = require('../spec_helper').requirejs
three = require('../stubs/three').three
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

module_mock.stub(requirejs, 'ext/three', three)
mesh = three.mesh
thing = three.thing

SpriteView = requirejs("lib/sprite_view")
texture_name = "my_texture.png"
view = null

describe "sprite view", ->
  describe "when being created", ->
    it "should create a mesh", ->
      view = new SpriteView(thing, texture_name)
      expect(view.mesh).not.toBe(null)

  describe "when creating a mesh", ->
    beforeEach ->
      view = new SpriteView(thing, texture_name)

    it "should create a square using the thing width and height", ->
      expect(three.PlaneGeometry).toHaveBeenCalledWith(100, 80)

    it "should position the mesh where the thing is", ->
      expect(mesh.position.x).toBe(40)
      expect(mesh.position.y).toBe(80)

    it "should create a material using the correct texture", ->
      expect(three.ImageUtils.loadTexture).toHaveBeenCalledWith(texture_name)

    it "should rotate the plane on the x axis so it faces the camera", ->
      expect(mesh.rotation.x).toBe(-90)
      expect(mesh.rotation.y).toBe(0)
