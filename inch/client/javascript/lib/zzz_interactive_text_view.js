define(['ext/zepto.min', 'lib/text_view'], function($, TextView) {
  "use strict";

  return function(id) {
    var _this = new TextView(id);
    _this.on_click_action = null;
    _this.enabled = true;

    _this.on_click = function(f) {
      _this.on_click_action = f;
      $("#" + id).on('click', _this.respond_to_on_click);
    };

    _this.respond_to_on_click = function(e) {
      if (!_this.enabled) {
        e.preventDefault();
        return ;
      }

      _this.on_click_action();
      e.preventDefault();
    };

    _this.disable = function() {
      _this.enabled = false;
      $("#" + id).addClass('disabled');
    };

    _this.enable = function() {
      _this.enabled = true;
      $("#" + id).removeClass('disabled');
    };

    return _this;
  };
});
