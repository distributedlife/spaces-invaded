"use strict";

var rek = require('rekuire');
var _ = require('underscore');
var bounding_box = rek('inch/private/js/bounding_box');
var unique = rek('inch/private/js/unique');
var requirejs = require('requirejs');
var temporary_effect = requirejs('inch/public/js/lib/temporary_effect');

module.exports = function(model) {
  var effect_duration = 4.0;

  var fire = {}
  _.extend(fire, temporary_effect(effect_duration));
  _.extend(fire, {
    id: unique.id(),
    x: model.x,
    y: model.y,
    width: 4,
    height: 10,
    name: "fire",
    active: true,

    update: function(delta) { this.tick(delta); },
    box: function() { return bounding_box(this.x, this.y, this.width, this.height); },
    collide: function(other_thing) {}
  });

  return fire;
};
