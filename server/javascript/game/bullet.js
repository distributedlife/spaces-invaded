"use strict";

var bounding_box = require('../lib/bounding_box');

module.exports = function(team) {
  return {
    x: 0,
    y: 0,
    width: 4,
    height: 20,
    velocity: 0,
    team: team,
    name: "bullet",
    active: false,

    shoot: function(velocity, x, y) {
      this.velocity = velocity;
      this.x = x;
      this.y = y;
      this.active = true;
    },

    move: function(delta) { this.y += (delta * this.velocity); },
    update: function(delta) { this.move(delta); },
    box: function() { return bounding_box(this.x, this.y, this.width, this.height); },

    collide: function(other_thing) {
      if (other_thing.team !== this.team) {
        this.die();
      }
    },

    die: function() { this.active = false; }
  };
};
