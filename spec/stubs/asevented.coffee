asevented = ((slice) ->
  bind = jasmine.createSpy('asEvented.bind')
  trigger = jasmine.createSpy('asEvented.trigger')

  ->
    @bind = bind
    @trigger = trigger
    this
)([].slice)

exports.asevented = asevented
