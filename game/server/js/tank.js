"use strict";

var rek = require('rekuire');
var _ = require('underscore');
var teams = rek('enums/teams');
var config = rek('inch/private/js/config');
var bounding_box = rek('inch/private/js/bounding_box');
var unique = rek('inch/private/js/unique');

module.exports = function(bullet) {
  return {
    id: unique.id(),
    width: 66,
    height: 42,
    x: 400,
    y: 500,
    maxVelocity: 300,
    team: teams.earth,
    active: true,
    name: "tank",
    to_move: 0,
    
    die: function() {
      if (config.nodamage) { return; }
      this.active = false;
    },

    box: function() { return bounding_box(this, this.x, this.y, this.width, this.height); },
    
    collide: function(other_thing) {
      if (other_thing.team === teams.invaders) {
        this.die();
      }
      if (other_thing.name === "fire") {
        this.to_move /= 2;
      }
    },

    move_left: function(force) { this.to_move = this.maxVelocity * force * -1; },
    move_right: function(force) { this.to_move = this.maxVelocity * force * 1; },
    stop: function() { this.to_move = 0; },

    stop_left: function() { if (this.to_move < 0) { this.stop(); } },
    stop_right: function() { if (this.to_move > 0) { this.stop(); } },
    
    joystick_move: function(x, y, force) {
      this.to_move = this.maxVelocity * force * x; 
    },

    move: function(delta) {
      var move_this_frame = ~~ (this.to_move * delta);
      this.x += move_this_frame;
      this.to_move -= move_this_frame;
    },

    update: function(delta) { this.move(delta); },
    
    shoot: function() {
      if (!this.active) { return; }
      if (bullet.active) { return; }

      bullet.shoot(-200, this.x, this.y);
    }
  }
};