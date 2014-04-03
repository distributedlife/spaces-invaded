exports.label = ( ->
  label =
    update_text: jasmine.createSpy('update_text')
    add_class: jasmine.createSpy('add_class')
    remove_class: jasmine.createSpy('remove_class')
    show: jasmine.createSpy('show')
    hide: jasmine.createSpy('hide')

  return label
)()

exports.control = ( ->
  control =
    update_text: jasmine.createSpy('update_text')
    on_click: jasmine.createSpy('on_click')
    show: jasmine.createSpy('show')
    hide: jasmine.createSpy('hide')
    enable: jasmine.createSpy('enable')
    disable: jasmine.createSpy('disable')
    remove_class: jasmine.createSpy('remove_class')
    add_class: jasmine.createSpy('add_class')

  return control
)()

exports.link_label = ( ->
  link_label =
    link:
      update_text: jasmine.createSpy('link.update_text')
      on_click: jasmine.createSpy('link.on_click')
    label:
      update_text: jasmine.createSpy('label.update_text')
      add_class: jasmine.createSpy('label.add_class')
      remove_class: jasmine.createSpy('label.remove_class')
    show: jasmine.createSpy('show')
    update_text: jasmine.createSpy('update_text')

  return link_label
)()

exports.ui_builder = ( ->
  ui_builder =
    build_label: jasmine.createSpy('build_label').andReturn(exports.label)
    build_control: jasmine.createSpy('build_control').andReturn(exports.control)
    build_link_label: jasmine.createSpy('build_link_label').andReturn(exports.link_label)

  return ui_builder
)()
