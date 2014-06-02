exports.spy_on = (requirejs, module) ->
  constructor = jasmine.createSpy(module)
  requirejs.define module, [], () ->
    constructor
  constructor

exports.stub = (requirejs, module, stub) ->
  requirejs.define module, [], () ->
    stub

exports.spy_and_mock = (requirejs, module, returned) ->
  constructor = jasmine.createSpy(module).andReturn(returned)
  requirejs.define module, [], () ->
    constructor
  constructor

exports.stop = (requirejs, module) ->
  requirejs.undef(module)

exports.reset = (requirejs) ->
  defined = requirejs.s.contexts._.defined
  requirejs.undef(module) for module in Object.keys(defined)
  registry = requirejs.s.contexts._.registry
  requirejs.undef(module) for module in Object.keys(registry)

exports.listen_for_events_on = (obj) ->
  obj.on_event = jasmine.createSpy('on_event')

exports.capture_events_on = (obj) ->
  obj.on_event = (event, func) ->
    obj["test_" + event] = func

exports.capture_click_events_on = (obj) ->
  obj.on_click = (func) ->
    obj["test_click"] = func