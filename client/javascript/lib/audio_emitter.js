define(["lib/unique", "lib/tracks_state_changes", "lib/config"], function(unique, tracks_state_changes, config) {
  "use strict";

  return function(sound_manager, filename, additional_options, f) {
    var configure_options = function() {
      additional_options = additional_options || {};
      additional_options.volume = additional_options.volume || 100;

      return additional_options;
    };

    var audio_emitter = {};
    _.extend(audio_emitter, tracks_state_changes);
    _.extend(audio_emitter, {
      
      sound: sound_manager.createSound({ id: unique.id(), url: filename }),
      options: configure_options(),

      update_from_model: function(new_state) {
        this.update_state(new_state)

        if (f === undefined) {
          return;
        }
        if (this.changed_strict(f) && this.is(f)) {
          this.play();
        } 
        if (this.changed_strict(f) && !this.is(f)) {
          //TODO: implement different stop mechanisms (fade out; instant; default is instant)
          this.stop();
        }
      },

      play: function() { 
        //TODO: make this an actual global i.e. not implemented here. Wait for switch to web 3d audio though
        this.options.volume = additional_options.volume * config.global_volume;
        this.sound.play(this.options); 
      },
      stop: function() { this.sound.stop(); }
    });
    
    return audio_emitter;
  };
});
