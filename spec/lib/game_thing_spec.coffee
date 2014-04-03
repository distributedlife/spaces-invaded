requirejs = require('../spec_helper').requirejs

thing = requirejs("lib/thing")
describe "a game thing", ->
  t = ->
    return this

  beforeEach ->
    thing.call(t)

  describe "when created", ->
    it "should be inactive", ->
      expect(t.active).toBeFalsy()

  describe "when updating", ->
    beforeEach ->
      t.update = jasmine.createSpy('t.u')

    it "should not update if inactive", ->
      t.update_if_active()
      expect(t.update).not.toHaveBeenCalled()

    it "should update if active", ->
      t.active = true
      t.update_if_active()
      expect(t.update).toHaveBeenCalled()
