var _ = require('underscore');

module.exports = function(game_state) {
  "use strict";

  var screen_edge_margin = 1;

  return {
    all_the_things: function() {
      return [game_state.bullet, game_state.tank].concat(game_state.invader_bullets).concat(game_state.invaders);
    },
    
    update: function(dt) {
      this.check_for_tank_at_screen_edge();

      var active_things = _.where(this.all_the_things(), {active: true});
      var things_to_update = _.reject(active_things, function(thing) { return thing.update === undefined; });
      
      _.each(things_to_update, function(thing) { thing.update(dt); });

      this.check_for_bullets_off_screen(active_things);

      var things_that_can_collide = _.reject(active_things, function(thing) { return thing.collide === undefined; });
      this.check_for_collisions(things_that_can_collide);
    },

    check_for_collisions: function(active_things) {
      _.each(active_things, function(thing) {
        _.each(active_things, function(other_thing) {
          if(thing.box().is_colliding_with(other_thing.box())) {
            thing.collide(other_thing);
            other_thing.collide(thing);
          }
        });
      });
    },

    check_for_bullets_off_screen: function(active_things) {
      var bullets = _.filter(active_things, function(thing) { return thing.name === "bullet" || thing.name == "invader bullet"; });

      _.each(bullets, function(bullet) {
        if (bullet.box().bottom() < 0) { bullet.die(); }
        if (bullet.box().top() > game_state.dimensions.height) { bullet.die(); }
      });
    },

    check_for_tank_at_screen_edge: function() {
      var tank = game_state.tank;
      if (tank.box().left() < screen_edge_margin) { 
        tank.stop_left();
        tank.x = tank.box().half_width;
      }
      if (tank.box().right() > game_state.dimensions.width - screen_edge_margin) {
        tank.stop_right();
        tank.x = game_state.dimensions.width - tank.box().half_width;
      }
    }
  }
};