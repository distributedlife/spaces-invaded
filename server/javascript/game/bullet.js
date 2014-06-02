"use strict";

var bounding_box = require('../lib/bounding_box');
var unique = require('../lib/unique');

module.exports = function(team) {
  return {
    id: unique.id(),
    x: 0,
    y: 0,
    width: 4,
    height: 20,
    velocity: 0,
    team: team,
    name: "bullet",
    active: false,
    reason: "",

    shoot: function(velocity, x, y) {
      this.velocity = velocity;
      this.x = x;
      this.y = y;
      this.active = true;
    },
    move: function(delta) { 
      this.y += (delta * this.velocity); 
    },
    update: function(delta) { 
      this.move(delta); 
    },
    box: function() { 
      return bounding_box(this.x, this.y, this.width, this.height); 
    },
    collide: function(other_thing) {
      if (other_thing.team !== this.team) {
        this.die("collision");
      }
    },
    die: function(reason) { 
      this.active = false; 
      this.reason = reason; 
    }
  };
};
