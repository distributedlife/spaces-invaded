define(["game/bullet", "game/enums"], function(Bullet, Enums) {
  "use strict";

  return function() {
    var _this = new Bullet();

    _this.team = Enums.Teams.Invaders;

    _this.collide = function(other_thing) {
      if (other_thing.team === Enums.Teams.Earth) {
        _this.die();
      }
    };

    return _this;
  };
});
