requirejs = require('../spec_helper').requirejs
three = require('../stubs/three').three
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

Three = module_mock.stub(requirejs, 'ext/three', three)

grid_view = null
width = 100
height = 150

vector = (x,y) ->
  {x: x, y: y, z: 0}

GridView = requirejs("lib/grid_view")
Config = requirejs("lib/config")

describe "grid view", ->
  beforeEach ->
    grid_view = new GridView(width, height)

  it "should enable or disable the grid based on the config", ->
    expect(grid_view.line.visible).toBe(Config.grid.enabled)

module_mock.reset(requirejs)
