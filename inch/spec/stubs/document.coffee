exports.document = (jsdom) ->
  document = jsdom.jsdom("<html><head></head><body></body></html>")
  document

exports.window = (jsdom) ->
  document = jsdom.jsdom("<html><head></head><body></body></html>")
  window = document.createWindow()
  window
