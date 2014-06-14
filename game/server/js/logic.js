var rek = require('rekuire');
var _ = require('underscore');
var team = rek('enums/teams');
var filter = rek('inch/private/js/common_filters');
var common = rek('inch/private/js/common_logic');
var collision_detection = rek('inch/private/js/collision_detection');

module.exports = function(game_state, entities) {
  "use strict";

  var screen_edge_margin = 1;

  return {
    permanent_things: [game_state.bullet, game_state.tank, game_state.swarm].concat(game_state.invader_bullets).concat(game_state.invaders),

    all_the_things: function() {
      return this.permanent_things.concat(game_state.fires);
    },
    
    update: function(dt) {
      this.check_for_tank_at_screen_edge();

      var active_things = filter.inactive_things(this.all_the_things());
      var things_to_update = filter.static_things(active_things);
      var things_that_can_collide = filter.things_that_cant_collide(active_things)

      collision_detection.check_for_collisions_using_aabb(things_that_can_collide);
      game_state.wireframes = common.build_wireframes(things_that_can_collide);

      common.update_each_thing(things_to_update, dt);

      this.check_for_bullets_off_screen(active_things);
      this.check_for_swarm_at_edge_of_screen();

      this.remove_expired_fires();
    },

    create_bullet_miss_fire: function (bullet) {
      game_state.fires.push(new entities.fire(bullet));
    },


    remove_expired_fires: function() {
      game_state.fires = filter.active_temporary_things(game_state.fires);
    },

    check_for_bullets_off_screen: function(active_things) {
      var bullets = _.filter(active_things, function(thing) { return thing.name === "bullet" || thing.name == "invader bullet"; });

      _.each(bullets, function(bullet) {
        if (common.is_off_screen(bullet, game_state.dimensions)) { 
          bullet.die("out-of-bounds");
          this.create_bullet_miss_fire(bullet);

          if (bullet.team === team.earth) {
            game_state.misses += 1;
          }
        }
      }.bind(this));
    },

    check_for_swarm_at_edge_of_screen: function() {
      var swarm = game_state.swarm;

      if (swarm.direction === 1) {
        if (swarm.box().right() > game_state.dimensions.width) { 
          swarm.invade(); 
        }
      } else {
        if (swarm.box().left() < 0) { 
          swarm.invade(); 
        }
      }
    },

    check_for_tank_at_screen_edge: function() {
      var tank = game_state.tank;

      _.each(tank.box(), function(bb) {
        if (bb.left() < screen_edge_margin) { 
          tank.stop_left();
          tank.x = bb.half_width;
        }
        if (bb.right() > game_state.dimensions.width - screen_edge_margin) {
          tank.stop_right();
          tank.x = game_state.dimensions.width - bb.half_width;
        }
      });
    }
  }
};