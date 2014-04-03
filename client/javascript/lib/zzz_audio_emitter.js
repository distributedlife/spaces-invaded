define([], function() {
  "use strict";

  return function(sound_manager, id, filename) {
    var audo_emitter = this;
    audo_emitter.sound = null;
    audo_emitter.volume = 100;

    audo_emitter.loadSound = function() {
      //TODO: can we auto-generate the ID property or reuse the url?
      //TODO: can the resources be served by the express?
      audo_emitter.sound = sound_manager.createSound({ id: id, url: filename });
    };

    audo_emitter.play = function(additional_options) {
      //typeof variable or typeof options?
      var options = additional_options || {}
      // if (typeof options === 'undefined') {
        // options = {};
      // }
      options.volume = audo_emitter.volume;

      sound_manager.volume(options);

      audo_emitter.sound.play(options);
    };

    audo_emitter.stop = function() {
      audo_emitter.sound.stop();
    };

    audo_emitter.loadSound();
    
    return audo_emitter;
  };
});
