requirejs = require('../spec_helper').requirejs
asevented = require('../stubs/asevented').asevented
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

module_mock.stub(requirejs, 'ext/asevented', asevented)
invaders = []
swarm = null
config =
  cols: 2
  col_margin: 10
  col_pad: 20
  row_margin: 30
  row_pad: 40
  left_extent: 0
  right_extent: 800
  direction: -1
stub_invader = (active) ->
  invader =
    invade: jasmine.createSpy("invader_invade")
    active: active
    box:
      x: 0
      y: 0
      half_width: 50
      left: () -> this.x - this.half_width
      right: () -> this.x + this.half_width
    on_event: jasmine.createSpy('on_event')
    spawn: jasmine.createSpy('spawn')
    type: "Bug"
    shift: jasmine.createSpy('invader.shift')
  return invader
other_thing =
  team: "Swarm"
  box:
    left: jasmine.createSpy('box.left')
    right: jasmine.createSpy('box.right')

Swarm = requirejs('invaders/swarm')
describe "Swarm", ->
  describe "when the swarm collides with something", ->
    beforeEach ->
      swarm = new Swarm(invaders, config)
      swarm.invade = jasmine.createSpy('swarm.invade')

    describe "when it collides with a swarm", ->
      it "should calculate the overlap with the swarm", ->
        swarm.calculate_overlap_with_other_swarm = jasmine.createSpy('s.cowos')
        swarm.collide(other_thing)
        expect(swarm.calculate_overlap_with_other_swarm).toHaveBeenCalled()

      it "should invade", ->
        swarm.collide(other_thing)
        expect(swarm.invade).toHaveBeenCalled()

        other_thing.team = 'Earth'
        swarm.collide(other_thing)
        expect(swarm.invade).toHaveBeenCalled()

        other_thing.team = 'Invaders'
        swarm.collide(other_thing)
        expect(swarm.invade).toHaveBeenCalled()


  describe "when invaders aren't hitting the edge of the screen", ->
    it "should not invade", ->
      swarm = new Swarm(invaders, config)
      swarm.invade = jasmine.createSpy('swarm.invade')
      swarm.is_hitting_left_edge = jasmine.createSpy('is_hitting_left_edge').andReturn(false)
      swarm.is_hitting_right_edge = jasmine.createSpy('is_hitting_right_edge').andReturn(false)
      swarm.update()
      expect(swarm.invade).not.toHaveBeenCalled()


  describe "when invading", ->
    beforeEach ->
      invaders = [stub_invader(true), stub_invader(true)]
      swarm = new Swarm(invaders, config)
      swarm.reverse_direction = jasmine.createSpy('swarm.reverseDirection')
      swarm.update_box_dimensions = jasmine.createSpy('swarm.update_box_dimensions')
      swarm.invade(5)

    it "should tell all the invaders to INVADE", ->
      expect(invaders[0].invade).toHaveBeenCalled()
      expect(invaders[1].invade).toHaveBeenCalled()

    it "should shift all invaders so they don't overlap other swarms or walls", ->
      expect(invaders[0].shift).toHaveBeenCalledWith(5, 0, 0)
      expect(invaders[1].shift).toHaveBeenCalledWith(5, 0, 0)

    it "should update it's dimensions", ->
      expect(swarm.update_box_dimensions).toHaveBeenCalled()

    it "should change direction", ->
      expect(swarm.reverse_direction).toHaveBeenCalled()


  describe "is heading", ->
    it "should return true if heading in speified direction", ->
      invaders = [stub_invader(true)]
      swarm = new Swarm(invaders, config)
      expect(swarm.is_heading(-1)).toBeTruthy()
      expect(swarm.is_heading(1)).toBeFalsy()


  describe "is hitting right edge", ->
    beforeEach ->
      invaders = []
      swarm = new Swarm(invaders, config)
      swarm.direction = 1
      swarm.box.right = jasmine.createSpy('swarm.box.right').andReturn(800)

    it "should return true if an invader is over or touching the right edge", ->
      expect(swarm.is_hitting_right_edge()).toBeTruthy()

    it "should return false if the swarm is not heading right", ->
      swarm.direction = -1
      expect(swarm.is_hitting_right_edge()).toBeFalsy()


  describe "is hitting left edge", ->
    beforeEach ->
      invaders = []
      swarm = new Swarm(invaders, config)
      swarm.direction = -1
      swarm.box.left = jasmine.createSpy('swarm.box.left').andReturn(0)

    it "should return true if an invader is over or touching the left edge", ->
      expect(swarm.is_hitting_left_edge()).toBeTruthy()

    it "should return false if the swarm is not heading left", ->
      swarm.direction = 1
      expect(swarm.is_hitting_left_edge()).toBeFalsy()


  describe "reverse direction", ->
    it "should reverse the direction of the swarm", ->
      invaders = [stub_invader(true)]
      swarm = new Swarm(invaders, config)
      expect(swarm.direction).toBe(-1)
      swarm.reverse_direction()
      expect(swarm.direction).toBe(1)
      swarm.reverse_direction()
      expect(swarm.direction).toBe(-1)


  describe "when the swarm is moving", ->
    beforeEach ->
      invaders = []
      swarm = new Swarm(invaders, config)
      swarm.invade = jasmine.createSpy('swarm.invade')
      swarm.update_box_dimensions = jasmine.createSpy('swarm.update_box_dimensions')

    it "should update it's dimensions", ->
      swarm.update()
      expect(swarm.update_box_dimensions).toHaveBeenCalled()

    describe "when one of the invaders hits the right edge of the screen", ->
      beforeEach ->
        swarm.is_hitting_left_edge = jasmine.createSpy('is_hitting_left_edge').andReturn(false)
        swarm.is_hitting_right_edge = jasmine.createSpy('is_hitting_right_edge').andReturn(true)

      it "should determine the overlap with the view edges", ->
        swarm.calculate_overlap_with_view_edge = jasmine.createSpy('swarm.calculateOverlapWithViewEdge')
        swarm.update()
        expect(swarm.calculate_overlap_with_view_edge).toHaveBeenCalled()

      it "should invade", ->
        swarm.update()
        expect(swarm.invade).toHaveBeenCalled()

    describe "when one of the invaders hits the left edge of the screen", ->
      beforeEach ->
        swarm.is_hitting_left_edge = jasmine.createSpy('is_hitting_left_edge').andReturn(true)
        swarm.is_hitting_right_edge = jasmine.createSpy('is_hitting_right_edge').andReturn(false)

      it "should determine the overlap with the view edges", ->
        swarm.calculate_overlap_with_view_edge = jasmine.createSpy('swarm.calculateOverlapWithViewEdge')
        swarm.update()
        expect(swarm.calculate_overlap_with_view_edge).toHaveBeenCalled()

      it "should invade", ->
        swarm.update()
        expect(swarm.invade).toHaveBeenCalled()

  describe "when updating the dimensions", ->
    beforeEach ->
      invaders = [stub_invader(true), stub_invader(true), stub_invader(true)]
      swarm = new Swarm(invaders,config)
      invaders[0].box.left = -> 50
      invaders[1].box.left = -> 100
      invaders[2].box.left = -> 150
      invaders[0].box.right= -> 200
      invaders[1].box.right= -> 300
      invaders[2].box.right= -> 400

    it "should set the swarm left most edge to be the left most invader's left value", ->
      swarm.update_box_dimensions()
      expect(swarm.box.left()).toEqual(invaders[0].box.left())

    it "should set the swarm right most edge to be the right most invader's right value", ->
      swarm.update_box_dimensions()
      expect(swarm.box.right()).toEqual(invaders[2].box.right())

    it "should ignore inactive invaders", ->
      invaders[0].active = false
      invaders[2].active = false
      swarm.update_box_dimensions()
      expect(swarm.box.left()).toEqual(invaders[1].box.left())
      expect(swarm.box.right()).toEqual(invaders[1].box.right())

  describe "when assembling the swarm", ->
    beforeEach ->
      invaders = [stub_invader(true), stub_invader(true), stub_invader(true), stub_invader(true), stub_invader(true)]
      invaders.forEach((invader) -> invader.type = "Squid")
      invaders[3].type = "Bug"
      invaders[4].type = "Skull"
      swarm = new Swarm(invaders, config)

    it "should set the invader direction", ->
      expect(invaders[0].spawn).toHaveBeenCalledWith(any(Number), any(Number), config.direction)

    it "increase the row after each column is full", ->
      expect(invaders[0].spawn).toHaveBeenCalledWith(any(Number), 30, any(Number))
      expect(invaders[1].spawn).toHaveBeenCalledWith(any(Number), 30, any(Number))
      expect(invaders[2].spawn).toHaveBeenCalledWith(any(Number), 70, any(Number))

    it "should offset each row by the padding", ->
      expect(invaders[0].spawn).toHaveBeenCalledWith(any(Number), config.row_margin, any(Number))
      expect(invaders[2].spawn).toHaveBeenCalledWith(any(Number), config.row_pad + config.row_margin, any(Number))

    it "should offset each col by the padding", ->
      expect(invaders[0].spawn).toHaveBeenCalledWith(config.col_margin, any(Number), any(Number))
      expect(invaders[1].spawn).toHaveBeenCalledWith(config.col_pad + config.col_margin, any(Number), any(Number))
      expect(invaders[2].spawn).toHaveBeenCalledWith(config.col_margin, any(Number), any(Number))

    it "should offset the BUGS by the number of squids", ->
      expect(invaders[3].spawn).toHaveBeenCalledWith(config.col_pad + config.col_margin, 70, any(Number))

    it "should offset the SKULLS by the number of bugs and skulls", ->
      expect(invaders[4].spawn).toHaveBeenCalledWith(config.col_margin, 110, any(Number))


  describe "when setting up the swarm", ->
    beforeEach ->
      invaders = [stub_invader(true)]
      swarm = new Swarm(invaders, config)

    it "should track each invaders death", ->
      expect(invaders[0].on_event).toHaveBeenCalledWith('die', swarm.track_invader_death)


  describe "when an invader dies", ->
    beforeEach ->
      invaders = [stub_invader(true), stub_invader(true)]
      swarm = new Swarm(invaders, config)

    it "should decrement the active invader count", ->
      expect(swarm.active_invaders).toBe(2)
      swarm.track_invader_death()
      expect(swarm.active_invaders).toBe(1)


  describe "when all invaders are dead", ->
    beforeEach ->
      invaders = [stub_invader(true)]
      swarm = new Swarm(invaders, config)

    it "should trigger a swarm death", ->
      swarm.die = jasmine.createSpy('die')
      swarm.track_invader_death()
      expect(swarm.active_invaders).toBe(0)
      expect(swarm.die).toHaveBeenCalled()


  describe "when a swarm dies", ->
    it "should emit a swarm die event", ->
      invaders = [stub_invader(true), stub_invader(true)]
      swarm = new Swarm(invaders, config)
      swarm.share_locally = jasmine.createSpy('share_locally')
      swarm.die()
      expect(swarm.share_locally).toHaveBeenCalledWith('die')

  describe "calculate overlap with view edge", ->
    beforeEach ->
      invaders = []
      swarm = new Swarm(invaders, config)
      
    describe "when heading right", ->
      beforeEach ->
        swarm.box.right = -> 900
        swarm.direction = 1

      it "should return the overlap", ->
        expect(swarm.calculate_overlap_with_view_edge()).toBe(100)

    describe "when heading left", ->
      beforeEach ->
        swarm.box.left = -> -100
        swarm.direction = -1

      it "should return the overlap", ->
        expect(swarm.calculate_overlap_with_view_edge()).toBe(-100)

  describe "calculate overlap with other swarm", ->
    beforeEach ->
      invaders = []
      swarm = new Swarm(invaders, config)

    describe "this swarm is on the right", ->
      it "should return the overlap offset by 1", ->
        swarm.box.left = -> 200
        swarm.box.right = -> 500
        other_thing.box.right = -> 400
        expected = 201

        expect(swarm.calculate_overlap_with_other_swarm(other_thing)).toBe(expected)

    describe "this swarm is on the left", ->
      it "should return the overlap", ->
        swarm.box.left = -> 500
        swarm.box.right = -> 200
        other_thing.box.left = -> 300
        expected = -101

        expect(swarm.calculate_overlap_with_other_swarm(other_thing)).toBe(expected)
