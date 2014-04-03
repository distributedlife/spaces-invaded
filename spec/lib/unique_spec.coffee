requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)
asevented = require('../stubs/asevented').asevented

module_mock.stub(requirejs, 'ext/asevented', asevented)
unique = requirejs("lib/unique")

describe "unique", ->
  it "should assign a unique id to each object that is extended", ->
    current = unique.id()
    next = unique.id()

    expect(next).toBe(current + 1)
