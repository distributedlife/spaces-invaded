var _ = require('underscore');
var team = require('./enums/teams');

module.exports = function(game_state, entities) {
  "use strict";

  var screen_edge_margin = 1;

  return {
    permanent_things: [game_state.bullet, game_state.tank, game_state.swarm].concat(game_state.invader_bullets).concat(game_state.invaders),
    temporary_things: [],

    all_the_things: function() {
      return this.permanent_things.concat(this.temporary_things);
    },
    
    update: function(dt) {
      this.check_for_tank_at_screen_edge();

      //TODO: pull function up to lib/logic but make invocation manual
      var active_things = _.where(this.all_the_things(), {active: true});
      //TODO: pull functionup to lib/logic but make invocation manual
      var things_to_update = _.reject(active_things, function(thing) { return thing.update === undefined; });
      //TODO: pull functionup to lib/logic but make invocation manual
      _.each(things_to_update, function(thing) { thing.update(dt); });

      this.check_for_bullets_off_screen(active_things);
      this.check_for_swarm_at_edge_of_screen();

      //TODO: pull functionup to lib/logic but make invocation manual
      var things_that_can_collide = _.reject(active_things, function(thing) { return thing.collide === undefined; });
      this.check_for_collisions(things_that_can_collide);

      //TODO: pull functionup to lib/logic but make invocation manual
      this.expire_temporary_things();
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

    is_off_screen: function(thing) {
      if (thing.box().bottom() < 0) { return true; }
      if (thing.box().top() > game_state.dimensions.height) { return true; }

      return false;
    },

    create_bullet_miss_fire: function (bullet) {
      var fire = new entities.fire(bullet);

      game_state.fires.push(fire);
      this.temporary_things.push(fire);
    },

    check_for_bullets_off_screen: function(active_things) {
      var bullets = _.filter(active_things, function(thing) { return thing.name === "bullet" || thing.name == "invader bullet"; });

      _.each(bullets, function(bullet) {
        if (this.is_off_screen(bullet)) { 
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
      if (tank.box().left() < screen_edge_margin) { 
        tank.stop_left();
        tank.x = tank.box().half_width;
      }
      if (tank.box().right() > game_state.dimensions.width - screen_edge_margin) {
        tank.stop_right();
        tank.x = game_state.dimensions.width - tank.box().half_width;
      }
    },

    expire_temporary_things: function() {
      this.temporary_things = _.select(this.temporary_things, function(thing) { return thing.is_alive() === true; });
      game_state.fires = _.select(game_state.fires, function(thing) { return thing.is_alive() === true; });
    }
  }
};