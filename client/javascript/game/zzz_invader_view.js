define(["lib/sprite_view", "game/enums", "game/resources"], function(SpriteView, Enums, Resources) {
  "use strict";

  return function(invader) {
    var get_texture = function(type) {
      switch (type) {
        case Enums.InvaderTypes.Bug: return Resources.Images.InvaderBug;
        case Enums.InvaderTypes.Squid: return Resources.Images.InvaderSquid;
        case Enums.InvaderTypes.Skull: return Resources.Images.InvaderSkull;
      }
    };

    var _this = new SpriteView(invader, get_texture(invader.type));
    _this.mesh.position.z = 100;

    invader.on_event('spawn', _this.show);
    invader.on_event('spawn', _this.update_position);
    invader.on_event('update', _this.update_position);
    invader.on_event('die', _this.hide);

    return _this;
  };
});

