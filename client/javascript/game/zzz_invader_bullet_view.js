define(["lib/sprite_view", "game/resources"], function(SpriteView, Resources) {
  "use strict";

  return function(invader_bullet) {
    var _this = new SpriteView(invader_bullet, Resources.Images.InvaderBullet);

    invader_bullet.on_event('spawn', _this.show);
    invader_bullet.on_event('spawn', _this.update_position);
    invader_bullet.on_event('die', _this.hide);
    invader_bullet.on_event('update', _this.update_position);

    return _this;
  };
});
