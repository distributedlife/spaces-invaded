"use strict";

var config = require('../lib/config');
var _ = require('underscore');
var bounding_box = require('../lib/bounding_box');
var teams = require('./enums/teams');

module.exports = function(bullet) {
  return {
    width: 66,
    height: 42,
    x: 400,
    y: 500,
    maxVelocity: 300,
    team: teams.earth,
    active: true,
    name: "tank",
    to_move: 0,
    
    spawn: function() {this.active = true;},
    
    die: function() {
      if (config.nodamage) { return; }
      this.active = false;
    },

    box: function() { return bounding_box(this.x, this.y, this.width, this.height); },
    
    collide: function(other_thing) {
      if (other_thing.team === teams.invaders) {
        this.die();
      }
    },

    move_left: function(force) {
      this.to_move = this.maxVelocity * force * -1;
    },
    
    move_right: function(force) {
      this.to_move = this.maxVelocity * force * 1;
    },

    stop: function() {
      this.to_move = 0;
    },

    stop_left: function() {
      if (this.to_move < 0) { this.stop(); }
    },

    stop_right: function() {
      if (this.to_move > 0) { this.stop(); }
    },
    
    move: function(delta) {
      var move_this_frame = ~~ (this.to_move * delta);
      this.x += move_this_frame;
      this.to_move -= move_this_frame;
    },

    update: function(delta) { this.move(delta); },
    
    shoot: function() {
      if (bullet.active) { return; }

      bullet.shoot(-200, this.x, this.y);
    }
  }
};