sound =
  play: jasmine.createSpy('play')
  stop: jasmine.createSpy('stop')
  setVolume: jasmine.createSpy('setVolume')

exports.sound = sound

exports.sound_manager = ( ->
  sound_manager =
    createSound: jasmine.createSpy('createSound').andReturn(sound)
    volume: jasmine.createSpy('volume')

  return sound_manager
)()
