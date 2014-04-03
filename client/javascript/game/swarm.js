define(["lib/bounding_box", "lib/event_emitter", "invaders/enums", "lib/thing"],
        function(BoundingBox, event_emitter, enums, thing) {
  "use strict";

  return function(invaders, swarm_config) {
    var _this = this;
    event_emitter.call(_this);
    thing.call(_this);

    _this.init = function() {
      _this.typename = "swarm";
      _this.direction = swarm_config.direction;
      _this.box = new BoundingBox(0, 0, 0, 0);
      _this.active_invaders = invaders.length;
      _this.active = true;
      _this.team = enums.Teams.Swarm;

      invaders.forEach(function(invader) {
        invader.on_event('die', _this.track_invader_death);
      });

      _this.arrange();
    };

    var min = function(array) {
      return Math.min.apply(Math, array);
    };

    var max = function(array) {
      return Math.max.apply(Math, array);
    };


    var collect_invader_left_x_positions = function() {
      return invaders.filter(function(invader) {
        return invader.active;
      }).map(function(invader) {
        return invader.box.left();
      });
    };

    var collect_invader_right_x_positions = function() {
      return invaders.filter(function(invader) {
        return invader.active;
      }).map(function(invader) {
        return invader.box.right();
      });
    };

    var collect_invaders_by_type = function(type) {
      return invaders.filter(function(invader) {
        return invader.type === type;
      });
    };

    _this.is_heading = function(direction) {
      return (_this.direction === direction);
    };

    _this.reverse_direction = function() {
      _this.direction = (_this.direction === enums.Directions.Right) ? enums.Directions.Left : enums.Directions.Right;
    };

    _this.update_box_dimensions = function() {
      var min_x = min(collect_invader_left_x_positions());
      var max_x = max(collect_invader_right_x_positions());

      _this.box.half_width = (max_x - min_x) / 2;
      _this.box.x = min_x + _this.box.half_width;
    };

    _this.is_hitting_left_edge = function() {
      return (_this.is_heading(enums.Directions.Left) && (_this.box.left() <= swarm_config.left_extent));
    };

    _this.is_hitting_right_edge = function() {
      return (_this.is_heading(enums.Directions.Right) && (_this.box.right() >= swarm_config.right_extent));
    };

    var position_invader = function(invader, i) {
      var row = Math.floor(i / swarm_config.cols);
      var col = i % swarm_config.cols;
      var x = col * swarm_config.col_pad + swarm_config.col_margin;
      var y = row * swarm_config.row_pad + swarm_config.row_margin;

      invader.spawn(x, y, swarm_config.direction);
    };

    _this.arrange = function() {
      var squids = collect_invaders_by_type(enums.InvaderTypes.Squid);
      var bugs = collect_invaders_by_type(enums.InvaderTypes.Bug);
      var skulls = collect_invaders_by_type(enums.InvaderTypes.Skull);

      squids.forEach(function(invader, i) {
        position_invader(invader, i);
      });
      bugs.forEach(function(invader, i) {
        position_invader(invader, i + squids.length);
      });
      skulls.forEach(function(invader, i) {
        position_invader(invader, i + squids.length + bugs.length);
      });
    };

    _this.reduce_active_invader_count = function() {
      _this.active_invaders -= 1;
    };

    _this.track_invader_death = function() {
      _this.reduce_active_invader_count();

      if (_this.active_invaders === 0) {
        _this.die();
      }
    };

    _this.calculate_overlap_with_view_edge = function() {
      if (_this.is_heading(enums.Directions.Right)) {
        return _this.box.right() - swarm_config.right_extent;
      }
      if (_this.is_heading(enums.Directions.Left)) {
        return _this.box.left() + swarm_config.left_extent;
      }
    };

    _this.update = function(delta) {
      _this.update_box_dimensions();

      if(_this.is_hitting_right_edge() || _this.is_hitting_left_edge()) {
        var overlap = _this.calculate_overlap_with_view_edge();
        _this.invade(overlap);
      }
    };

    _this.die = function() {
      _this.share_locally('die') ;
    };

    _this.invade = function(amount_to_shift) {
      invaders.forEach(function(invader) {
        invader.invade();
        invader.shift(amount_to_shift, 0, 0);
      });

      _this.reverse_direction();
      _this.update_box_dimensions();
    };

    _this.calculate_overlap_with_other_swarm = function(other_thing) {
      var bump = 1;

      if (_this.box.right() >= other_thing.box.right()) {
        return other_thing.box.right() - _this.box.left() + bump;
      } else {
        return _this.box.right() - other_thing.box.left() - bump;
      }
    };

    _this.collide = function(other_thing) {
      if (other_thing.team === enums.Teams.Swarm) {
        var overlap = _this.calculate_overlap_with_other_swarm(other_thing);
        _this.invade(overlap);
      }
    };

    _this.init();
    return _this;
  };
});
