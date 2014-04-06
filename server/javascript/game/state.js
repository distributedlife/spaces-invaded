module.exports = function(entities) {
  "use strict";

  var reset_state = function(state) {
    state.bullet = Object.create(entities.bullet());
    state.tank = Object.create(entities.tank(state.bullet));
    state.players = 0;
    state.observers = 0;
    state.paused = true;
    state.all_the_things = [this.bullet, this.tank];
    state.dimensions = {
      width: 0,
      height: 0
    }
  }

  var state = {
    reset: reset_state
  }
  state.reset(state);

  return state;
};