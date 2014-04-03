requirejs = require('../spec_helper').requirejs

GameLogic = requirejs('invaders/game_logic')
describe "game logic", ->
  game_logic = null
  thing = null
  other_thing = null
  collision = null
  atom =
    Game: ->
      return {}
    input:
      mouse:
        x: Math.random()
        y: Math.random()
  gamepad_states =
    [
      leftStickX: Math.random()
      rightStickY: Math.random()
    ]
  Gamepad =
    getStates: jasmine.createSpy('getStates').andReturn(gamepad_states)

  beforeEach ->
    thing =
      update_if_active: jasmine.createSpy('update')
      collide: jasmine.createSpy('collide')
      box: {is_colliding_with: jasmine.createSpy('box_is_colliding_with') }
      active: true
    other_thing =
      update_if_active: jasmine.createSpy('update')
      collide: jasmine.createSpy('collide')
      box: {is_colliding_with: jasmine.createSpy('box_is_colliding_with') }
      active: true
    game_logic = new GameLogic([thing, other_thing])


  describe "when checking for collisions", ->
    it "should check that everything that is active is colliding with everything else that is active", ->
      game_logic = new GameLogic([thing, other_thing])
      game_logic.check_for_collisions()
      expect(thing.box.is_colliding_with).toHaveBeenCalledWith(other_thing.box)
      expect(other_thing.box.is_colliding_with).toHaveBeenCalledWith(thing.box)

    it "should not check inactive things to see if they are colliding with anything", ->
      inactive_thing = {active: false, box: {is_colliding_with: jasmine.createSpy('inactive_thing_is_colliding_with')}}
      game_logic = new GameLogic([thing, other_thing, inactive_thing])
      game_logic.check_for_collisions()
      expect(inactive_thing.box.is_colliding_with).not.toHaveBeenCalled()
      expect(thing.box.is_colliding_with).not.toHaveBeenCalledWith(inactive_thing.box)
      expect(other_thing.box.is_colliding_with).not.toHaveBeenCalledWith(inactive_thing.box)

    it "should call collide on both things if they collide", ->
      thing.box.is_colliding_with.andReturn(true)
      game_logic.check_for_collisions()
      expect(thing.collide).toHaveBeenCalledWith(other_thing)
      expect(other_thing.collide).toHaveBeenCalledWith(thing)

    it "shouldn't call collide if things aren't colliding", ->
      game_logic.check_for_collisions()
      expect(thing.collide).not.toHaveBeenCalledWith(other_thing)
      expect(other_thing.collide).not.toHaveBeenCalledWith(thing)


  describe "when it is updating", ->
    it "then ALL THE THINGS should be updated", ->
      dt = Math.random()
      game_logic.update(dt, atom.input)
      expect(thing.update_if_active).toHaveBeenCalledWith(dt, atom.input)
      expect(other_thing.update_if_active).toHaveBeenCalledWith(dt, atom.input)

    it "then ALL THE THINGS should check for collisions", ->
      spyOn(game_logic, 'check_for_collisions')
      game_logic.update()
      expect(game_logic.check_for_collisions).toHaveBeenCalled()
