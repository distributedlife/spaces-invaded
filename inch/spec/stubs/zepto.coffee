show = jasmine.createSpy('zepto.show')
hide = jasmine.createSpy('zepto.hide')
addClass = jasmine.createSpy('zepto.addClass')
removeClass = jasmine.createSpy('zepto.removeClass')
on_func = jasmine.createSpy('zepto.on')

exports.zepto = () ->
  show: show
  hide: hide
  addClass: addClass
  removeClass: removeClass
  on: on_func
