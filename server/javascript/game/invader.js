"use strict";

var config = require('../lib/config');
var _ = require('underscore');
var bounding_box = require('../lib/bounding_box');
var team = require('./enums/teams');
var unique = require('../lib/unique');

module.exports = function(bullet, type) {
  var dimensions = {
    "bug":   { width: 44, height: 48},
    "squid": { width: 36, height: 48},
    "skull": { width: 48, height: 48}
  };

  var number_of_seconds_between_shots = 20;

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
    shoot_countdown: Math.random() * number_of_seconds_between_shots,
    
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
      if(this.its_time_to_shoot()) {
        bullet.shoot(50, this.x, this.y);

        this.shoot_countdown = number_of_seconds_between_shots;
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