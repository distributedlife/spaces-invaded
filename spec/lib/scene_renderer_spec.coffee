requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)
three = require('../stubs/three').three

renderer =
  setSize: jasmine.createSpy('setSize')
  domElement: {}
  render: jasmine.createSpy('render')
three =
  WebGLRenderer: jasmine.createSpy('WebGLRenderer').andReturn(renderer)
module_mock.stub(requirejs, "ext/three", three)

SceneRenderer = requirejs("lib/scene_renderer")
element =
  appendChild: jasmine.createSpy('appendChild')
scene = {}
camera = {}
width = 900
height = 600

sr = null

describe "scene renderer", ->
  beforeEach ->
    sr = new SceneRenderer(element, scene, camera)

  describe "when being created", ->
    it "should create a renderer", ->
      expect(three.WebGLRenderer).toHaveBeenCalled()

    it "should configure the renderer with preserveDrawingBuffer", ->
      expect(three.WebGLRenderer).toHaveBeenCalledWith({preserveDrawingBuffer: true, antialias: true})

    it "should add the renderer to the element", ->
      expect(element.appendChild).toHaveBeenCalledWith(renderer.domElement)

  describe "resizing the screen", ->
    beforeEach ->
      sr.resize(width, height)

    it "should configure the renderer dimensions", ->
      expect(renderer.setSize).toHaveBeenCalledWith(900, 600)

  describe "animate", ->
    beforeEach ->
      sr.animate()

    it "should call render", ->
      expect(renderer.render).toHaveBeenCalledWith(scene, camera)
