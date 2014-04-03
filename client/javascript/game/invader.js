define(["game/enums", "lib/bounding_box", "lib/event_emitter", "lib/thing"],
        function(enums, BoundingBox, event_emitter, thing) {
  "use strict";

  return function(bullet, type) {
    var _this = this;

    var dimensions = {
      "Bug": function() {
        _this.width = 44;
        _this.height = 48;
      },
      "Squid": function() {
        _this.width = 36;
        _this.height = 48;
      },
      "Skull": function() {
        _this.width = 48;
        _this.height = 48;
      }
    };
    dimensions[type]();

    _this.team = enums.Teams.Invaders;
    _this.name = 'invader';
    _this.velocity = 50;
    _this.box = new BoundingBox(0, 0, _this.width, _this.height);
    _this.type = type;
    _this.direction = enums.Directions.Right;
    _this.invade_drop = 10;
    _this.invade_speedup = 1.075;

    event_emitter.call(_this);
    thing.call(_this);

    _this.collide = function(other_thing) {
      if (other_thing.team === enums.Teams.Earth) {
        _this.die();
      }
    };

    _this.spawn = function(centre_x, centre_y, direction) {
      _this.active = true;
      _this.box.x = centre_x;
      _this.box.y = centre_y;
      _this.direction = direction;
      _this.share_locally('spawn', _this);
    };

    _this.die = function() {
      _this.active = false;
      _this.share_locally('die');
    };

    var number_of_seconds_between_shots = 20;
    var shoot_countdown = Math.random() * number_of_seconds_between_shots;
    var its_time_to_shoot = function() {
      return shoot_countdown <= 0;
    };

    _this.update = function(delta_time) {
      shoot_countdown -= delta_time;
      if(its_time_to_shoot()) {
        bullet.shoot(50, _this.box.x, _this.box.y);

        shoot_countdown = number_of_seconds_between_shots;
      }

      _this.move(delta_time);
    };

    _this.move = function(delta_time) {
      _this.box.x += delta_time * _this.velocity * _this.direction;
      _this.share_locally('update', _this);
    };

    _this.invade = function() {
      _this.box.y += _this.invade_drop;
      _this.direction *= enums.Directions.Reverse;
      _this.velocity = _this.velocity * _this.invade_speedup;
    };

    _this.shift = function(x, y, z) {
      _this.box.x += x;
      _this.box.y += z;
    };

    return _this;
  };
});
