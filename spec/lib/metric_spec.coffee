requirejs = require('../spec_helper').requirejs
module_mock = require('../stubs/module_mock')
module_mock.reset(requirejs)

ws =
  send: jasmine.createSpy('send')
  readyState: 1
WebSocket = module_mock.spy_and_mock(requirejs, "ext/websocket", ws)

Metric = requirejs("lib/metric")
describe "Metric", ->
  metric = new Metric()
  date = null

  beforeEach ->
    date = new Date()
    global = jasmine.getGlobal()
    global.Date = jasmine.createSpy('Date').andReturn(date)
    ws.readyState = 1

  describe "when posting a message", ->
    it "should do nothing if the socket is not open", ->
      ws.readyState = 3
      metric.post "my_metric" 
      expect(ws.send).not.toHaveBeenCalled()

    it "should send on the websocket using the name", ->
      expected = '{"type":"my_metric","time":"' + date.toJSON() + '"}'
      metric.post "my_metric"
      expect(ws.send).toHaveBeenCalledWith expected

    it "should send a json blob if supplied", ->
      expected = '{"type":"my_metric","time":"' + date.toJSON() + '","data":{"banana":1.5}}'
      metric.post "my_metric", {banana: 1.5}
      expect(ws.send).toHaveBeenCalledWith expected
