cricket_socket = ((slice) ->
  on_remote_event = jasmine.createSpy('cricket_socket.on_remote_event')
  share_remotely = jasmine.createSpy('cricket_socket.share_remotely')

  ->
    @on_remote_event = on_remote_event
    @share_remotely = share_remotely
    this
)([].slice)
exports.cricket_socket = cricket_socket

exports.io = ( ->
  socket =
    on: jasmine.createSpy('socket.io.on')
    emit: jasmine.createSpy('socket.io.emit')
  io =
    connect: jasmine.createSpy('socket.io.connect').andReturn(socket)#

  return io
)()
