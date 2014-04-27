var config = require('../lib/config');

module.exports = function(game_state, game_logic, input_bindings) {
  return {
  	prior_step: Date.now(),

  	step: function() {
      if (game_state.paused) {
        this.prior_step = Date.now();
        return;
      }

      var now = Date.now();
      var dt = (now - this.prior_step) / 1000 * config.global_time_dilation;
      this.prior_step = Date.now();
      
      input_bindings.map_input_to_action();
      game_logic.update(dt);
    },

    run: function() {
      this.step();
      setTimeout(this.run.bind(this), 1000 / 120);
    }
  };
};