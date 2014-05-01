define(["lib/unique"], function(unique) {
  "use strict";

  return function(sound_manager, filename, additional_options, f) {
    var configure_options = function() {
      additional_options = additional_options || {};
      additional_options.volume = additional_options.volume || 100;

      return additional_options;
    };

    var audio_emitter = {
      sound: sound_manager.createSound({ id: unique.id(), url: filename }),
      options: configure_options(),

      //TODO: mix in behaviour
      prior_state: null,
      current_state: null,
      update_state: function(new_state) {
        this.prior_state = this.current_state;
        this.current_state = new_state;
      },
      changed_strict: function(f) { 
        if (this.prior_state === null) { return false; }

        return f(this.prior_state) !== f(this.current_state); 
      },
      is: function(f) { return f(this.current_state) === true; },

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

      play: function() { this.sound.play(this.options); },
      stop: function() { this.sound.stop(); }
    };
    
    return audio_emitter;
  };
});
