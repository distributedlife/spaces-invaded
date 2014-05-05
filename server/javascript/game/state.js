var team = require('./enums/teams');
var invader_types = require('./enums/invaders');

module.exports = function(entities) {
  "use strict";

  var make_invader_bullets = function() {
    var bullets = []
    
    for(var i = 0; i < 50; ++i) {
      bullets.push(new entities.bullet(team.invaders));
    }

    return bullets;
  };

  var make_invaders = function(bullets) {
    var invaders = [];

    for(var i = 0; i < 10; ++i) {
      invaders.push(new entities.invader(bullets[i], invader_types.squid));
    }
    for(var i = 0; i < 20; ++i) {
      invaders.push(new entities.invader(bullets[10 + i], invader_types.bug));
    }
    for(var i = 0; i < 20; ++i) {
      invaders.push(new entities.invader(bullets[30 + i], invader_types.skull));
    }
    return invaders;
  };

  var tank_bullet = new entities.bullet(team.earth);
  var invader_bullets = make_invader_bullets();
  var invaders = make_invaders(invader_bullets);

  return {
    bullet: tank_bullet,
    tank: new entities.tank(tank_bullet),
    invader_bullets: invader_bullets,
    invaders: invaders,
    swarm: new entities.swarm(invaders),
    players: 0,
    observers: 0,
    paused: true,
    dimensions: { width: 1000, height: 500 }
  };
};