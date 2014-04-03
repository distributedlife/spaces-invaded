exports.wait_for_all = ( ->
  wait_for_all =
    start: jasmine.createSpy('wait_for_all.start')

  return wait_for_all
)()

