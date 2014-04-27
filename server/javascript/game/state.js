var team = require('./enums/teams');
var invader_types = require('./enums/invaders');

module.exports = function(entities) {
  "use strict";

  var make_invader_bullets = function() {
    var bullets = []
    
    for(var i = 0; i < 50; ++i) {
      bullets.push(Object.create(entities.bullet(team.invaders)));
    }

    return bullets;
  };

  var make_invaders = function(bullets) {
    var invaders = [];

    for(var i = 0; i < 10; ++i) {
      var a = Object.create(entities.invader(bullets[i], invader_types.squid));
      console.log("MIKE: WHEN I LOG THIS OBJECT, I SHOWS {}, BUT IT HAS 'THINGS'");
      console.log(a);
      console.log("MIKE: SEE:"+a.type);
      invaders.push(a);
    }
    for(var i = 0; i < 20; ++i) {
      invaders.push(Object.create(entities.invader(bullets[10 + i], invader_types.bug)));
    }
    for(var i = 0; i < 20; ++i) {
      invaders.push(Object.create(entities.invader(bullets[30 + i], invader_types.skull)));
    }
    return invaders;
  };

  var tank_bullet = Object.create(entities.bullet(team.earth));
  var tank = Object.create(entities.tank(tank_bullet));
  var invader_bullets = make_invader_bullets();
  var invaders = make_invaders(invader_bullets);

  return {
    bullet: tank_bullet,
    tank: tank,
    invader_bullets: invader_bullets,
    invaders: invaders,
    swarm: Object.create(entities.swarm(invaders)),
    players: 0,
    observers: 0,
    paused: true,
    dimensions: {
      width: 0,
      height: 0
    }
  };
};