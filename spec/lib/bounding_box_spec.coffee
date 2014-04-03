requirejs = require('../spec_helper').requirejs

BoundingBox = requirejs("lib/bounding_box")
box = null
describe "BoundingBox", ->
  beforeEach ->
    box = new BoundingBox(50, 20, 30, 40)

  describe "left", ->
    it "should return x minus half width", ->
      expect(box.left()).toBe(35)

  describe "right", ->
    it "should return y plus half width", ->
      expect(box.right()).toBe(65)

  describe "top", ->
    it "should return y minus half height", ->
      expect(box.top()).toBe(0)

  describe "bottom", ->
    it "should return y plus half height", ->
      expect(box.bottom()).toBe(40)

  describe "collision detection", ->
    box_overlapping = null
    box_not_overlapping = null

    beforeEach ->
      box_overlapping = new BoundingBox(50, 20, 30, 40)
      box_not_overlapping = new BoundingBox(1, 2, 3, 4)

    it "should not detect a collision with itself", ->
      expect(box.is_colliding_with(box)).toBeFalsy()

    it "should detect a collision with an overlapping box", ->
      expect(box.is_colliding_with(box_overlapping)).toBeTruthy()

    it "should not detect a collision with boxes that is not overlapping", ->
      expect(box.is_colliding_with(box_not_overlapping)).toBeFalsy()
