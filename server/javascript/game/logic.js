var _ = require('underscore');

module.exports = function(game_state) {
  "use strict";

  var pixel_buffer = 1;

  return {
    update: function(dt) {
      this.check_for_tank_at_screen_edge();

      var things_to_update = _.reject(game_state.all_the_things, function(thing) { return thing.update === undefined; });
      
      _.each(things_to_update, function(thing) { thing.update(dt); });

      this.check_for_collisions();
      this.check_for_bullets_off_screen();
    },

    check_for_collisions: function() {
      var active_things = _.where(game_state.all_the_things, {active: true});

      _.each(active_things, function(thing) {
        _.each(active_things, function(other_thing) {
          if(thing.box().is_colliding_with(other_thing.box())) {
            thing.collide(other_thing);
            other_thing.collide(thing);
          }
        });
      });
    },

    check_for_bullets_off_screen: function() {
      var bullets = _.filter(game_state.all_the_things, function(thing) { return thing.name === "bullet" || thing.name == "invader bullet"; });

      _.each(bullets, function(bullet) {
        if (bullet.box().bottom() < 0) { bullet.die(); }
        if (bullet.box().top() > game_state.dimensions.height) { bullet.die(); }
      });
    },

    check_for_tank_at_screen_edge: function() {
      var tank = game_state.tank;
      if (tank.box().left() < pixel_buffer) { 
        tank.stop_left();
        tank.x = tank.box().half_width;
      }
      if (tank.box().right() > game_state.dimensions.width - pixel_buffer) {
        tank.stop_right();
        tank.x = game_state.dimensions.width - tank.box().half_width;
      }
    }
  }
};