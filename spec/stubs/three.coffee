exports.three = ( ->
  mesh =
    position:
      x: 0
      y: 0
    rotation:
      x: 0
      y: 0
    visible: true
  thing =
    width: 100
    height: 80
    box:
      x: 40
      y: 80
  scene =
    add: jasmine.createSpy('scene.add')
  camera =
    position:
      x: 0
      y: 0
      z: 0
  renderer =
    setSize: jasmine.createSpy('renderer.set_size')
    render: jasmine.createSpy('render')
    domElement: "document.createElement('canvas')"
  geometry =
    vertices: []
    colors: []
  vector3 = (x, y, z) ->
    {x: x, y: y, z: z}
  color =
  line =
    visible: jasmine.createSpy('three.line.visible')
    type: jasmine.createSpy('three.line.type')
  three =
    WebGLRenderer: jasmine.createSpy("webgl_renderer").andReturn(renderer)
    PlaneGeometry: jasmine.createSpy("cube_geometry")
    MeshBasicMaterial: jasmine.createSpy("mesh_basic_material")
    LineBasicMaterial: jasmine.createSpy("three.line_basic_material")
    Mesh: jasmine.createSpy("mesh").andReturn(mesh)
    Line: jasmine.createSpy("line").andReturn(line)
    ImageUtils:
      loadTexture: jasmine.createSpy("load_texture")
    Scene: jasmine.createSpy("scene").andReturn(scene)
    OrthographicCamera: jasmine.createSpy("orthographic_camera").andReturn(camera)
    Geometry: jasmine.createSpy('three.geometry').andReturn(geometry)
    Vector3: jasmine.createSpy('three.vector3').andReturn(vector3)
    Color: jasmine.createSpy('three.color').andReturn(color)
    mesh: mesh
    thing: thing

  return three
)()
