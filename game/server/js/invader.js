"use strict";

var rek = require('rekuire');
var _ = require('underscore');
var team = rek('enums/teams');
var config = rek('inch/private/js/config');
var bounding_box = rek('inch/private/js/bounding_box');
var unique = rek('inch/private/js/unique');

module.exports = function(bullet, type, options) {
  var dimensions = {
    "bug":   { width: 44, height: 48},
    "squid": { width: 36, height: 48},
    "skull": { width: 48, height: 48}
  };

  options = options || {};
  _.defaults(options, {
    bullet_speed: 100,
    number_of_seconds_between_shots: 20
  })

  return {
    id: unique.id(),
    width: dimensions[type].width,
    height: dimensions[type].height,
    x: 400,
    y: 500,
    velocity: 50,
    team: team.invaders,
    active: true,
    name: "invader",
    type: type,
    direction: 1,
    invade_drop: 10,
    invade_speedup: 1.075,
    shoot_countdown: Math.random() * options.number_of_seconds_between_shots,
    has_clear_shot: false,
    
    spawn: function(cx, cy, direction) {
      this.active = true;
      this.x = cx;
      this.y = cy;
      this.direction = direction;
    },
    
    die: function() { this.active = false; },

    box: function() { return bounding_box(this.x, this.y, this.width, this.height); },
    
    collide: function(other_thing) {
      if (other_thing.team === team.earth) {
        this.die();
      }
    },
    
    its_time_to_shoot: function() { return this.shoot_countdown <= 0; },

    move: function(delta) {
      this.x += delta * this.velocity * this.direction;
    },

    update: function(delta) { 
      this.shoot_countdown -= delta;
      if(this.its_time_to_shoot() && this.has_clear_shot) {
        bullet.shoot(options.bullet_speed, this.x, this.y);

        this.shoot_countdown = options.number_of_seconds_between_shots;
      }

      this.move(delta); 
    },

    invade: function() {
      this.y += this.invade_drop;
      this.direction *= -1;
      this.velocity *= this.invade_speedup;
    }
  };
};