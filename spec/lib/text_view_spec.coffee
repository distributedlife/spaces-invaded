requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

text =
  style:
    display: 'banana'
    innerHTML: 'herp'
window =
  get_element_by_id: jasmine.createSpy('window.get_element_by_id').andReturn(text)
module_mock.stub(requirejs, 'lib/window', window)

$ = require('../stubs/zepto').zepto
module_mock.stub(requirejs, 'ext/zepto.min', $)

TextView = requirejs("lib/text_view")
text_view = null

id = "my_id"

describe 'a text view', ->
  beforeEach ->
    text_view = new TextView(id)

  describe 'creating a text view', ->
    it 'should link to the specified id', ->
      expect(window.get_element_by_id).toHaveBeenCalledWith(id)

  describe 'show', ->
    it 'should ask zepto to show the element', ->
      text_view.show()
      expect($().show).toHaveBeenCalled()

  describe 'hide', ->
    it 'should ask zepto to hide the element', ->
      text_view.hide()
      expect($().hide).toHaveBeenCalled()

  describe 'update text', ->
    it 'should set the value of the div', ->
      text_view.update_text('derp')
      expect(text_view.text.innerHTML).toBe('derp')

  describe 'add_class', ->
    it 'should ask zepto to add the class', ->
      text_view.add_class('derp')
      expect($().addClass).toHaveBeenCalledWith('derp')

  describe 'remove_class', ->
    it 'should ask zepto to remove the class', ->
      text_view.remove_class('derp')
      expect($().removeClass).toHaveBeenCalledWith('derp')
